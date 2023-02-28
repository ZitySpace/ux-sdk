import { createContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { newUseStore } from './factory';

import { CarouselStoreData } from '../stores/carouselStore';
import {
  ImageData,
  LabelType,
  keypointsLabelConfig,
} from '@zityspace/react-annotate';

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

export interface ImageMetaProps {
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

export const normalizeImagesMeta = (data: ImageMetaProps[]) => {
  return {
    carouselData: data.reduce(
      (res: CarouselStoreData['carouselData'], d: ImageMetaProps) => {
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
        (
          res: CarouselStoreData['selection']['selected'],
          d: ImageMetaProps
        ) => {
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

type APIsType = {
  getImagesCount: () => Promise<number>;

  getImagesMeta: (
    offset: number,
    limit: number,
    order_by: string
  ) => Promise<CarouselStoreData>;

  getImage: (file_name: string) => Promise<string>;

  getImagesCountByCategory: (category: string) => Promise<number>;

  getImagesMetaByCategory: (
    category: string,
    offset: number,
    limit: number,
    order_by: string
  ) => Promise<CarouselStoreData>;

  deleteImages: (
    filenames: string[],
    keepAnnotations?: boolean
  ) => Promise<string>;

  saveAnnotations: (imageData: ImageData) => Promise<string>;

  renameCategory: (
    oldCategory: string,
    newCategory: string,
    timestamp?: string
  ) => Promise<string[]>;
};

interface StoreData {
  apiEndpoint: string;
  projectSlug: string;
}

const storeDataDefault = {
  apiEndpoint:
    (typeof window !== 'undefined' && localStorage.getItem('apiEndpoint')) ||
    'http://localhost:8080/api',
  projectSlug:
    (typeof window !== 'undefined' && localStorage.getItem('projectSlug')) ||
    'fashiona',
};

interface Store extends StoreData {
  setApiEndpoint: (endpoint: string) => void;
  setProjectSlug: (slug: string) => void;
  apis: APIsType;
}

const createStoreFromData = (data: Partial<StoreData> = storeDataDefault) =>
  createStore<Store>((set, get) => ({
    apiEndpoint: data.apiEndpoint || storeDataDefault.apiEndpoint,
    projectSlug: data.projectSlug || storeDataDefault.projectSlug,

    setApiEndpoint: (apiEndpoint: string) => set({ apiEndpoint }),
    setProjectSlug: (projectSlug: string) => set({ projectSlug }),

    apis: {
      getImagesCount: requestTemplate(() => {
        return {
          url:
            get().apiEndpoint +
            '/project/images/count?slug=' +
            get().projectSlug,
          method: 'GET',
        };
      }),

      getImagesMeta: requestTemplate(
        (offset: number, limit: number, order_by: string) => {
          return {
            url:
              get().apiEndpoint +
              '/project/images/meta?slug=' +
              get().projectSlug +
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
      ),

      getImage: requestTemplate(
        (file_name: string) => {
          return {
            url:
              get().apiEndpoint +
              '/project/image?slug=' +
              get().projectSlug +
              '&file_name=' +
              file_name,
            method: 'GET',
          };
        },
        getImageResponseHandler,
        URL.createObjectURL
      ),

      getImagesCountByCategory: requestTemplate((category: string) => {
        return {
          url:
            get().apiEndpoint +
            '/project/images/category/count?slug=' +
            get().projectSlug +
            '&category=' +
            category,
          method: 'GET',
        };
      }),

      getImagesMetaByCategory: requestTemplate(
        (category: string, offset: number, limit: number, order_by: string) => {
          return {
            url:
              get().apiEndpoint +
              '/project/images/category/meta?slug=' +
              get().projectSlug +
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
      ),

      deleteImages: requestTemplate(
        (filenames: string[], keepAnnotations: boolean = false) => {
          const formData = new FormData();
          formData.set('slug', get().projectSlug!);
          formData.set('filenames', JSON.stringify(filenames));
          formData.set('keep_annotations', JSON.stringify(keepAnnotations));

          return {
            url: get().apiEndpoint + '/project/images',
            method: 'DELETE',
            body: formData,
          };
        }
      ),

      saveAnnotations: requestTemplate((imageData: ImageData) => {
        const formData = new FormData();
        formData.set('slug', get().projectSlug!);
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
          url: get().apiEndpoint + '/project/annotations',
          method: 'PUT',
          body: formData,
        };
      }),

      renameCategory: requestTemplate(
        (oldCategory: string, newCategory: string, timestamp?: string) => {
          return {
            url:
              get().apiEndpoint +
              '/project/category?slug=' +
              get().projectSlug +
              '&category=' +
              oldCategory +
              '&rename_to=' +
              newCategory +
              (timestamp ? '&at=' + timestamp : ''),
            method: 'PATCH',
          };
        }
      ),
    },
  }));

const storeDefault = createStoreFromData(storeDataDefault);
const StoreContext = createContext<StoreApi<Store>>(storeDefault);

const useStore = newUseStore<Store, StoreData>(
  createStoreFromData,
  storeDataDefault
);

const useAPIStore = () => useStore('default.apiStore');

export {
  StoreContext as APIStoreContext,
  StoreData as APIStoreData,
  storeDataDefault as APIStoreDataDefault,
  Store as APIStore,
  useAPIStore,
};
