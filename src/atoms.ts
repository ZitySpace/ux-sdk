import { atom } from 'jotai';
import {
  LabelType,
  Annotations,
  ImageData,
  keypointsLabelConfig,
} from '@zityspace/react-annotate';
import { getImageResponseHandler, requestTemplate, queryData } from './utils';
import { unwrap } from 'jotai/utils';

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
              }
              // fallback to origin point if anno.type not recognized
              else
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

interface LocalDataframe {
  header: string[];
  data: any[][];
  selected: boolean[];
}

interface RemoteDataframe {
  query: { host: string; code: string } | null;
}

const dataframeLocalAtom = atom<LocalDataframe>({
  header: [],
  data: [],
  selected: [],
});

const dataframeRemoteAtom = atom<RemoteDataframe>({
  query: null,
});

const dataframeIsRemoteAtom = atom<boolean>(false);

type DataframeConfig = LocalDataframe | RemoteDataframe;

const dataframeAsyncAtom = atom<
  Promise<{
    header: string[];
    selected: boolean[];
    getData: (
      start: number,
      end: number,
      byImage: boolean
    ) => Promise<any[][]> | any[][];
    getSize: (byImage: boolean) => Promise<number> | number;
  }>,
  DataframeConfig[],
  void
>(
  async (get) => {
    const isRemote = get(dataframeIsRemoteAtom);

    if (isRemote) {
      const { query } = get(dataframeRemoteAtom);
      if (!query)
        return {
          header: [],
          selected: [],
          getData: (
            start: number = 0,
            end: number = 0,
            byImage: boolean = false
          ) => [],
          getSize: (byImage: boolean = false) => 0,
        };

      const { host, code } = query!;
      const df = await queryData(host, code, 0, 0, false, true);
      const { header, size } = df ? df : { header: [], size: 0 };

      const getSize = async (byImage: boolean = false) => {
        const df = await queryData(host, code, 0, 0, byImage, true);
        const { size } = df ? df : { size: 0 };
        return size;
      };

      const getData = async (
        start: number = 0,
        end: number = size,
        byImage: boolean = false
      ) => {
        const df = await queryData(host, code, start, end, byImage, true);
        const { data } = df ? df : { data: [] };
        return data;
      };

      return {
        header,
        selected: Array(size).fill(false),
        getData,
        getSize,
      };
    } else {
      const { header, data, selected } = get(dataframeLocalAtom);
      console.log(header, data, selected);
      const { sizeByImageFunc, sliceByImageFunc } = dataframeUtils(header);

      const getData = (
        start: number = 0,
        end: number = selected.length,
        byImage: boolean = false
      ) => {
        if (!byImage) return data.slice(start, end);
        return sliceByImageFunc(data, start, end);
      };

      const getSize = (byImage: boolean = false) => {
        if (!byImage) return data.length;
        return sizeByImageFunc(data);
      };

      return {
        header,
        selected,
        getData,
        getSize,
      };
    }
  },
  (_, set, config) => {
    if ('query' in config) {
      set(dataframeIsRemoteAtom, true);
      set(dataframeRemoteAtom, config);
    } else {
      set(dataframeIsRemoteAtom, false);
      set(dataframeLocalAtom, config);
    }
  }
);

export const dataframeAtom = unwrap(dataframeAsyncAtom, (prev) => {
  console.log('prev: ', prev);
  return (
    prev ?? {
      header: [],
      selected: [],
      getData: (
        start: number = 0,
        end: number = 0,
        byImage: boolean = false
      ) => [],
      getSize: (byImage: boolean = false) => 57,
    }
  );
});

const dataframeUtils = (header: string[]) => {
  const idx = header.findIndex((v) => v === 'image_hash');
  const typeIdx = header.findIndex((v) => v === 'type');
  const optional = ['category'];

  const requiredMap: Record<string, string[]> = {
    box: ['x', 'y', 'w', 'h'],
    mask: ['mask'],
    keypoints: ['keypoints'],
  };

  const passMap: Record<string, boolean> = Object.fromEntries(
    Object.entries(requiredMap).map(([type, required]) => [
      type,
      !required.some((field) => !header.includes(field)),
    ])
  );

  const rowDataToAnno = (d: any[]) => {
    if (typeIdx === -1) return { name: d[idx] };

    const type = d[typeIdx] as string;
    const pass = passMap[type];

    if (!pass) return { name: d[idx] };

    const required = requiredMap[type];

    return Object.fromEntries(
      header
        .map((h, i) =>
          h === 'image_hash'
            ? ['name', d[i]]
            : h === 'type'
            ? ['type', d[i]]
            : required.includes(h) || optional.includes(h)
            ? h === 'mask'
              ? [
                  'paths',
                  (
                    d[i] as {
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
                ]
              : h === 'keypoints'
              ? ['keypoints', d[i]]
              : [h, d[i]]
            : []
        )
        .filter((e) => e.length)
    );
  };

  const groupByImageFunc: (data: any[][]) => CarouselData['carouselData'] = (
    data: any[][]
  ) =>
    data.reduce((res: CarouselData['carouselData'], d: any[]) => {
      const anno = rowDataToAnno(d);
      const hasAnno = 'type' in anno;
      const name = anno.name;
      const annos = name in res ? res[name].annotations! : [];

      return {
        ...res,
        [name]: {
          name: name,
          annotations: hasAnno ? [...annos, anno] : annos,
        },
      };
    }, {});

  const sizeByImageFunc = (data: any[][]) => {
    const names = data.map((d) => d[idx]);
    const uniqueNames = new Set(names);
    return uniqueNames.size;
  };

  const sliceByImageFunc = (data: any[][], start: number, end: number) => {
    const names = data.map((d) => d[idx]);
    const uniqueNames = Array.from(new Set(names));
    const nameSlice = new Set(uniqueNames.slice(start, end));

    const dataSlice = data.filter((d) => nameSlice.has(d[idx]));
    return dataSlice;
  };

  const initSelectionFunc = (carouselData: CarouselData['carouselData']) => ({
    selectable: false,
    selected: Object.keys(carouselData).reduce(
      (sel, name) => ({ ...sel, [name]: false }),
      {}
    ),
  });

  return {
    groupByImageFunc,
    sizeByImageFunc,
    sliceByImageFunc,
    initSelectionFunc,
  };
};

const dataframeFilterAtom = atom<Filter>((get) => {
  const { header, getData, getSize } = get(dataframeAtom);

  const { groupByImageFunc, initSelectionFunc } = dataframeUtils(header);

  return {
    sizeFilter: async () => await getSize(false),
    pageFilter: async (pos: number, step: number) => {
      const carouselData = groupByImageFunc(
        await getData(pos, pos + step, false)
      );
      const selection = initSelectionFunc(carouselData);
      return { carouselData, selection };
    },
  };
});

const dataframeGroupByImageFilterAtom = atom<Filter>((get) => {
  const { header, getData, getSize } = get(dataframeAtom);

  const { groupByImageFunc, initSelectionFunc } = dataframeUtils(header);

  return {
    sizeFilter: async () => await getSize(true),
    pageFilter: async (pos: number, step: number) => {
      const carouselData = groupByImageFunc(
        await getData(pos, pos + step, true)
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
  value?: string | DataframeConfig;
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
      set(dataframeAtom, value! as DataframeConfig);
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
      method: 'POST',
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
