import { atom } from 'jotai';
import {
  LabelType,
  Annotations,
  ImageData,
  keypointsLabelConfig,
} from '@zityspace/react-annotate';

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

export interface ImageProps {
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

type SizeFilter = () => number | Promise<number>;

type PageFilter = (
  pos: number,
  step: number,
  ...args: Array<any>
) => CarouselData | Promise<CarouselData>;

interface Filter {
  sizeFilter: SizeFilter;
  pageFilter: PageFilter;
}

interface Dataframe {
  header: string[];
  data: any[][];
  selected: boolean[];
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
    requireAuthentication: boolean = false
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
export const apiEndpointAtom = atom<string>('');
export const posAtom = atom<number>(0);
export const stepAtom = atom<number>(10);
export const totAtom = atom<number>(100);
export const carouselDataAtom = atom<CarouselData>({
  carouselData: {},
  selection: { selectable: false, selected: {} },
  switchOfFreshData: false,
});

const defaultFilterAtom = atom<Filter>((get) => ({
  sizeFilter: get(getImagesCountAtom),
  pageFilter: get(getImagesMetaAtom),
}));

export const categoryAtom = atom<string | null>(null);
const categoryFilterAtom = atom<Filter>((get) => {
  const category = get(categoryAtom);

  if (!category) return get(defaultFilterAtom);

  const getImagesCountByCategory = get(getImagesCountByCategoryAtom);
  const getImagesMetaByCategory = get(getImagesMetaByCategoryAtom);

  return {
    sizeFilter: async () => await getImagesCountByCategory(category),
    pageFilter: async (offset: number, limit: number, order_by: string) =>
      await getImagesMetaByCategory(category, offset, limit, order_by),
  };
});

export const dataframeAtom = atom<Dataframe>({
  header: [],
  data: [],
  selected: [],
});

const dataframeUtilsAtom = atom((get) => {
  const dataframe = get(dataframeAtom);
  const header = dataframe.header;

  const idx = header.findIndex((v) => v === 'image_hash');
  const required = ['x', 'y', 'w', 'h', 'type'];
  const optional = ['category'];
  const pass = !required.some((field) => !header.includes(field));

  const rowDataToAnno = (d: any[]) =>
    pass
      ? Object.fromEntries(
          header
            .map((h, i) =>
              h === 'image_hash'
                ? ['name', d[i]]
                : required.includes(h) || optional.includes(h)
                ? [h, d[i]]
                : []
            )
            .filter((e) => e.length)
        )
      : { name: d[idx] };

  const groupByImageFunc: (data: any[][]) => CarouselData['carouselData'] = (
    data: any[][]
  ) =>
    data.reduce((res: CarouselData['carouselData'], d: any[]) => {
      const anno = rowDataToAnno(d);
      const name = anno.name;
      return {
        ...res,
        [name]: {
          name: name,
          annotations: pass
            ? [...(name in res ? res[name].annotations! : []), anno]
            : null,
        },
      };
    }, {});

  const initSelectionFunc = (carouselData: CarouselData['carouselData']) => ({
    selectable: false,
    selected: Object.keys(carouselData).reduce(
      (sel, name) => ({ ...sel, [name]: false }),
      {}
    ),
  });

  return { groupByImageFunc, initSelectionFunc };
});

const dataframeFilterAtom = atom<Filter>((get) => {
  const dataframe = get(dataframeAtom);
  const data = dataframe.data;

  const { groupByImageFunc, initSelectionFunc } = get(dataframeUtilsAtom);

  return {
    sizeFilter: () => data.length,
    pageFilter: (pos: number, step: number) => {
      const carouselData = groupByImageFunc(data.slice(pos, pos + step));
      const selection = initSelectionFunc(carouselData);
      return { carouselData, selection };
    },
  };
});

const dataframeGroupByImageFilterAtom = atom<Filter>((get) => {
  const dataframe = get(dataframeAtom);
  const data = dataframe.data;

  const { groupByImageFunc, initSelectionFunc } = get(dataframeUtilsAtom);
  const dataGroupByImage = groupByImageFunc(data);
  const images = Object.keys(dataGroupByImage);

  return {
    sizeFilter: () => images.length,
    pageFilter: (pos: number, step: number) => {
      const carouselData = images
        .slice(pos, pos + step)
        .reduce(
          (res, name) => ({ ...res, [name]: dataGroupByImage[name] }),
          {}
        );
      const selection = initSelectionFunc(carouselData);

      return { carouselData, selection };
    },
  };
});

export const filterAtomMap = {
  default: defaultFilterAtom,
  byCategory: categoryFilterAtom,
  byDataframe: dataframeFilterAtom,
  byDataframeGroupByImage: dataframeGroupByImageFilterAtom,
};

export interface FilterProps {
  choice: keyof typeof filterAtomMap;
  value?: string | Dataframe;
}

export const filterAtom = atom<FilterProps, FilterProps[], void>(
  {
    choice: 'default',
    value: undefined,
  },
  (_, set, { choice, value }) => {
    set(filterAtom, { choice, value });

    // if (choice === 'default') {
    //   set(categoryAtom, null);
    //   set(dataframeAtom, {
    //     header: [],
    //     data: [],
    //     selected: [],
    //   });
    // }

    if (choice === 'byCategory') {
      set(categoryAtom, value! as string);
    }

    if (choice === 'byDataframe' || choice === 'byDataframeGroupByImage') {
      set(dataframeAtom, value! as Dataframe);
    }

    set(posAtom, 0);
  }
);

// api atoms
const getImagesCountAtom = atom<() => Promise<number>>((get) =>
  requestTemplate(() => {
    return {
      url: get(apiEndpointAtom) + '/images/count',
      method: 'GET',
    };
  })
);

const getImagesMetaAtom = atom<
  (offset: number, limit: number) => Promise<CarouselData>
>((get) =>
  requestTemplate(
    (offset: number, limit: number) => {
      return {
        url:
          get(apiEndpointAtom) +
          '/images/meta?offset=' +
          offset +
          '&limit=' +
          limit,
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
          url: get(apiEndpointAtom) + '/image?file_name=' + file_name,
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
      url: get(apiEndpointAtom) + '/images/category/count?category=' + category,
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
          '/images/category/meta?category=' +
          category +
          '&offset=' +
          offset +
          '&limit=' +
          limit,
        method: 'GET',
      };
    },
    ...[,],
    normalizeImagesMeta
  )
);

export const deleteImagesAtom = atom<
  (filenames: string[], keepAnnotations?: boolean) => Promise<string>
>((get) =>
  requestTemplate((filenames: string[], keepAnnotations: boolean = false) => {
    const formData = new FormData();
    formData.set('filenames', JSON.stringify(filenames));

    return {
      url: get(apiEndpointAtom) + '/images',
      method: 'DELETE',
      body: formData,
    };
  })
);

export const saveAnnotationsAtom = atom<
  (imageData: ImageData) => Promise<string>
>((get) =>
  requestTemplate((imageData: ImageData) => {
    const formData = new FormData();
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
                    length: Math.max(...keypointsLabelConfig.structure.flat()),
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
      url: get(apiEndpointAtom) + '/annotations',
      method: 'PUT',
      body: formData,
    };
  })
);

export const renameCategoryAtom = atom<
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
          '/category?category=' +
          oldCategory +
          '&rename_to=' +
          newCategory +
          (timestamp ? '&at=' + timestamp : ''),
        method: 'PATCH',
      };
    }
  )
);
