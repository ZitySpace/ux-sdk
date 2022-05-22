import { FilteringProps, ContextStore } from '../../stores/contextStore';
import { PagingStore } from '../../stores/pagingStore';
import {
  DataframeStore,
  DataframeStoreData,
} from '../../stores/dataframeStore';
import {
  CarouselStore,
  CarouselStoreDataDefault,
} from '../../stores/carouselStore';
import { useStore, StoreApi } from 'zustand';

export const useSetFiltering = ({
  pagingStore,
  contextStore,
}: {
  pagingStore: StoreApi<PagingStore>;
  contextStore: StoreApi<ContextStore>;
}) => {
  const { setFiltering: setFilteringCore } = useStore(contextStore, (s) => ({
    setFiltering: s.setFiltering,
  }));
  const setPos = useStore(pagingStore, (s) => s.setPos);

  const setFiltering = (filteringProps: FilteringProps) => {
    setFilteringCore(filteringProps);
    setPos(0);
  };

  return { setFiltering };
};

export const useSetDataframe = ({
  dataframeStore,
}: {
  dataframeStore: StoreApi<DataframeStore>;
}) => {
  const setDataframe = useStore(dataframeStore, (s) => s.setDataframe);

  return {
    setDataframe,
  };
};

export const useFilterFromDataframe = (
  { header, data }: DataframeStoreData,
  groupByImage: boolean = false
) => {
  const idx = header.findIndex((v) => v === 'image_hash');

  if (!header.includes('image_hash')) {
    return {
      by: 'Dataframe',
      value: data,
      dependsOnValue: false,
      sizeFilter: () =>
        groupByImage && header.includes('image_hash')
          ? new Set(data.map((d) => d[idx])).size
          : data.length,
      pageFilter: (pos: number, step: number) => CarouselStoreDataDefault,
    };
  }

  const required = ['x', 'y', 'w', 'h'];
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

  const groupByImageFunc: (data: any[][]) => CarouselStore['carouselData'] = (
    data: any[][]
  ) =>
    data.reduce((res: CarouselStore['carouselData'], d: any[]) => {
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

  const initSelectionFunc = (carouselData: CarouselStore['carouselData']) => ({
    selectable: false,
    selected: Object.keys(carouselData).reduce(
      (sel, name) => ({ ...sel, [name]: false }),
      {}
    ),
  });

  let filterOpt: FilteringProps;

  if (groupByImage) {
    const dataGroupByImage = groupByImageFunc(data);
    const images = Object.keys(dataGroupByImage);

    filterOpt = {
      by: 'DataframeGroupByImage',
      value: dataGroupByImage,
      dependsOnValue: false,
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
  } else {
    filterOpt = {
      by: 'Dataframe',
      value: data,
      dependsOnValue: false,
      sizeFilter: () => data.length,
      pageFilter: (pos: number, step: number) => {
        const carouselData = groupByImageFunc(data.slice(pos, pos + step));
        const selection = initSelectionFunc(carouselData);

        return { carouselData, selection };
      },
    };
  }

  return filterOpt;
};
