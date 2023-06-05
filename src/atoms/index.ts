import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import {
  LabelType,
  Annotations,
  ImageData,
  keypointsLabelConfig,
} from '@zityspace/react-annotate';
import { queryContext } from '@/hooks';
import { useEffect } from 'react';
import { atomsWithQuery } from 'jotai-tanstack-query';

interface ImageMetaProps {
  id: number;
  file_name: string;
  file_size: number;
  image_area: number;
  image_height: number;
  image_width: number;
  upload_time: string;
  annotations: {
    type: string;
    category: string;
    timestamp_z: string;
    unique_hash_z: string;
    [k: string]: unknown;
  }[];
}

interface ImageProps {
  id?: number;
  name: string;
  file_size?: number;
  image_area?: number;
  height?: number;
  width?: number;
  upload_time?: string;
  annotations?: Annotations | null;
}

interface CarouselData {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
  switchOfFreshData?: boolean;
}

const responseHandlerTemplate = async (response: Response) => {
  if (response.status === 401) {
    throw new Error('Not Authorized');
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  }

  const data = await response.json();

  if (response.status > 401 && response.status < 500) {
    const err = data.detail ? data.detail : data;
    throw err;
  }

  return data;
};

const getImageResponseHandler = async (response: Response) => {
  if (response.status === 401) {
    throw new Error('Not Authorized');
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  }

  const data = await response.blob();

  if (response.status > 401 && response.status < 500) {
    const err = JSON.parse(await data.text());
    throw new Error(err.detail);
  }

  return data;
};

export const requestTemplate =
  (
    requestConstructor: Function,
    responseHandler: Function = responseHandlerTemplate,
    dataTransformer: Function | null = null,
    requireAuthentication: boolean = true
  ) =>
  async (...args: any[]) => {
    const { url, method, headers, body } = requestConstructor(...args);
    const headersFinal = headers || new Headers({ Accept: 'application/json' });

    if (requireAuthentication) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not Authorized');
      }

      headersFinal.set('Authorization', `Bearer ${token}`);
    }

    const request = new Request(url, {
      method: method,
      headers: headersFinal,
      body: body,
    });
    const response = await fetch(request);

    const data = await responseHandler(response);

    return dataTransformer ? dataTransformer(data) : data;
  };

export const normalizeImagesMeta = (data: ImageMetaProps[]) => {
  return {
    carouselData: data.reduce(
      (res: CarouselData['carouselData'], d: ImageMetaProps) => {
        return {
          ...res,
          [d.file_name]: {
            id: d.id,
            name: d.file_name,
            file_size: d.file_size,
            image_area: d.image_area,
            height: d.image_height,
            width: d.image_width,
            upload_time: d.upload_time,
            annotations: (d.annotations || []).map((anno) => {
              if (anno.type === 'box')
                return {
                  type: LabelType.Box as const,
                  category: anno.category,
                  timestamp: anno.timestamp_z,
                  hash: anno.unique_hash_z,
                  x: anno.x as number,
                  y: anno.y as number,
                  w: anno.w as number,
                  h: anno.h as number,
                };
              else if (anno.type === 'mask')
                return {
                  type: LabelType.Mask as const,
                  category: anno.category,
                  timestamp: anno.timestamp_z,
                  hash: anno.unique_hash_z,
                  paths: (
                    anno.mask as {
                      points: number[];
                      closed?: boolean;
                      hole?: boolean;
                    }[]
                  ).map(({ points: pts, closed, hole }) => ({
                    points: Array.from({ length: pts.length / 2 }, (_, i) => ({
                      x: pts[2 * i],
                      y: pts[2 * i + 1],
                    })),
                    closed,
                    hole,
                  })),
                };
              // fallback to origin point if anno.type not recognized
              else if (anno.type === 'keypoints') {
                const keypoints = anno.keypoints as number[];

                return {
                  type: LabelType.Keypoints as const,
                  category: anno.category,
                  timestamp: anno.timestamp_z,
                  hash: anno.unique_hash_z,
                  keypoints: Array.from(
                    { length: keypoints.length / 3 },
                    (_, i) => ({
                      x: keypoints[3 * i],
                      y: keypoints[3 * i + 1],
                      vis: keypoints[3 * i + 2] === 2,
                      sid: keypoints[3 * i + 2] === 0 ? -1 : i + 1,
                    })
                  ).filter((pt) => pt.sid !== -1),
                  structure: anno.structure,
                };
              } else
                return {
                  type: LabelType.Point as const,
                  category: anno.category,
                  timestamp: anno.timestamp_z,
                  hash: anno.unique_hash_z,
                  x: 0,
                  y: 0,
                };
            }),
          },
        };
      },
      {}
    ),
    selection: {
      selected: data.reduce(
        (res: CarouselData['selection']['selected'], d: ImageMetaProps) => {
          return {
            ...res,
            [d.file_name]: false,
          };
        },
        {}
      ),
    },
  };
};

// base atoms
const apiEndpointAtom = atom<string>('http://localhost:8080/api');
const projectSlugAtom = atom<string>('fashiona');
export const posAtom = atom<number>(0);
export const stepAtom = atom<number>(10);
export const totAtom = atom<number>(100);
export const carouselDataAtom = atom<CarouselData>({
  carouselData: {},
  selection: { selectable: false, selected: {} },
  switchOfFreshData: false,
});

// api atoms
const getImagesCountAtom = atom<() => Promise<number>>((get) =>
  requestTemplate(() => {
    return {
      url:
        get(apiEndpointAtom) +
        '/project/images/count?slug=' +
        get(projectSlugAtom),
      method: 'GET',
    };
  })
);

const getImagesMetaAtom = atom<
  (offset: number, limit: number, order_by: string) => Promise<CarouselData>
>((get) =>
  requestTemplate(
    (offset: number, limit: number, order_by: string) => {
      return {
        url:
          get(apiEndpointAtom) +
          '/project/images/meta?slug=' +
          get(projectSlugAtom) +
          '&offset=' +
          offset +
          '&limit=' +
          limit +
          '&order_by=' +
          order_by,
        method: 'GET',
      };
    },
    ...[,],
    normalizeImagesMeta
  )
);

export const getImageAtom = atom<(file_name: string) => Promise<string>>(
  (get) =>
    requestTemplate(
      (file_name: string) => {
        return {
          url:
            get(apiEndpointAtom) +
            '/project/image?slug=' +
            get(projectSlugAtom) +
            '&file_name=' +
            file_name,
          method: 'GET',
        };
      },
      getImageResponseHandler,
      URL.createObjectURL
    )
);

const getImagesCountByCategoryAtom = atom<
  (category: string) => Promise<number>
>((get) =>
  requestTemplate((category: string) => {
    return {
      url:
        get(apiEndpointAtom) +
        '/project/images/category/count?slug=' +
        get(projectSlugAtom) +
        '&category=' +
        category,
      method: 'GET',
    };
  })
);

const getImagesMetaByCategoryAtom = atom<
  (
    category: string,
    offset: number,
    limit: number,
    order_by: string
  ) => Promise<CarouselData>
>((get) =>
  requestTemplate(
    (category: string, offset: number, limit: number, order_by: string) => {
      return {
        url:
          get(apiEndpointAtom) +
          '/project/images/category/meta?slug=' +
          get(projectSlugAtom) +
          '&category=' +
          category +
          '&offset=' +
          offset +
          '&limit=' +
          limit +
          '&order_by=' +
          order_by,
        method: 'GET',
      };
    },
    ...[,],
    normalizeImagesMeta
  )
);

const deleteImagesAtom = atom<
  (filenames: string[], keepAnnotations?: boolean) => Promise<string>
>((get) =>
  requestTemplate((filenames: string[], keepAnnotations: boolean = false) => {
    const formData = new FormData();
    formData.set('slug', get(projectSlugAtom));
    formData.set('filenames', JSON.stringify(filenames));
    formData.set('keep_annotations', JSON.stringify(keepAnnotations));

    return {
      url: get(apiEndpointAtom) + '/project/images',
      method: 'DELETE',
      body: formData,
    };
  })
);

const saveAnnotationsAtom = atom<(imageData: ImageData) => Promise<string>>(
  (get) =>
    requestTemplate((imageData: ImageData) => {
      const formData = new FormData();
      formData.set('slug', get(projectSlugAtom));
      formData.set(
        'annotation_records',
        JSON.stringify([
          {
            image_hash: imageData.name,
            image_width: imageData.width,
            image_height: imageData.height,
            annotations: imageData.annotations.map((anno) => {
              if (anno.type === 'box')
                return {
                  timestamp_z: anno.timestamp,
                  unique_hash_z: anno.hash,
                  category: anno.category,
                  x: anno.x,
                  y: anno.y,
                  w: anno.w,
                  h: anno.h,
                };
              else if (anno.type === 'mask')
                return {
                  timestamp_z: anno.timestamp,
                  unique_hash_z: anno.hash,
                  category: anno.category,
                  format: 'polygon',
                  mask: anno.paths.map((path) => ({
                    closed: path.closed,
                    hole: path.hole,
                    points: path.points.map((pt) => [pt.x, pt.y]).flat(),
                  })),
                };
              else if (anno.type === 'keypoints') {
                const keypointsMap = anno.keypoints.reduce(
                  (m: { [key: number]: number[] }, kp) => {
                    if (kp.sid === -1) return m;
                    return { ...m, [kp.sid]: [kp.x, kp.y, kp.vis ? 2 : 1] };
                  },
                  {}
                );

                return {
                  timestamp_z: anno.timestamp,
                  unique_hash_z: anno.hash,
                  category: anno.category,
                  keypoints: Array.from(
                    {
                      length: Math.max(
                        ...keypointsLabelConfig.structure.flat()
                      ),
                    },
                    (_, i) => i
                  )
                    .map((i) => keypointsMap[i + 1] || [0, 0, 0])
                    .flat(),
                };
              }
            }),
          },
        ])
      );

      return {
        url: get(apiEndpointAtom) + '/project/annotations',
        method: 'PUT',
        body: formData,
      };
    })
);

const renameCategoryAtom = atom<
  (
    oldCategory: string,
    newCategory: string,
    timestamp?: string
  ) => Promise<string[]>
>((get) =>
  requestTemplate(
    (oldCategory: string, newCategory: string, timestamp?: string) => {
      return {
        url:
          get(apiEndpointAtom) +
          '/project/category?slug=' +
          get(projectSlugAtom) +
          '&category=' +
          oldCategory +
          '&rename_to=' +
          newCategory +
          (timestamp ? '&at=' + timestamp : ''),
        method: 'PATCH',
      };
    }
  )
);

// query atoms
const carouselSizeAtom = atomsWithQuery((get) => ({
  queryKey: ['carouselSize'],
  queryFn: get(getImagesCountAtom),
  keepPreviousData: true,
  refetchOnWindowFocus: false,
  context: queryContext,
}));

// hooks
export const useJotaiCarouselSetSize = () => {
  const setTotal = useSetAtom(totAtom);
  const getImagesCount = useAtomValue(getImagesCountAtom);

  const {
    data: total,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['carouselSize'],
    queryFn: getImagesCount,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    context: queryContext,
  });

  useEffect(() => {
    if (isSuccess) setTotal(total);
  }, [isSuccess, total]);

  return { isLoading };
};

export const useJotaiCarouselSetPage = () => {
  const pos = useAtomValue(posAtom);
  const step = useAtomValue(stepAtom);
  const setCarouselData = useSetAtom(carouselDataAtom);
  const getImagesMeta = useAtomValue(getImagesMetaAtom);

  const {
    data: carouselData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['carouselData', pos, step],
    queryFn: () => getImagesMeta(pos, step, 'upload_time'),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    context: queryContext,
  });

  useEffect(() => {
    if (isSuccess) setCarouselData(carouselData);
  }, [isSuccess, carouselData]);

  return { isLoading };
};
