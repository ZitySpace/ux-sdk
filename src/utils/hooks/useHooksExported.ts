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

export const useFilterFromDataframe = ({
  header,
  data,
}: DataframeStoreData) => {
  const filterOpt: FilteringProps = {
    by: 'Dataframe',
    value: data,
    dependsOnValue: false,
    sizeFilter: () => data.length,
    pageFilter: (pos: number, step: number) => {
      const required = ['image_hash', 'x', 'y', 'w', 'h', 'category'];
      if (required.length && required.some((field) => !header.includes(field)))
        return CarouselStoreDataDefault;

      const rowDataToAnno = (d: any[]) =>
        header.reduce((anno, h, i) => {
          if (!required.includes(h)) return anno;
          const k = h === 'image_hash' ? 'name' : h;
          return { ...anno, [k]: d[i] };
        }, {}) as { name: any; x: any; y: any; w: any; h: any; category: any };

      const carouselData = data
        .slice(pos, pos + step)
        .reduce((res: CarouselStore['carouselData'], d: any[]) => {
          const anno = rowDataToAnno(d);
          const name = anno.name;
          return {
            ...res,
            [name]: {
              name: name,
              annotations: [...(res[name] ? res[name].annotations : []), anno],
            },
          };
        }, {});

      const selection = {
        selectable: false,
        selected: Object.keys(carouselData).reduce(
          (sel, name) => ({ ...sel, [name]: false }),
          {}
        ),
      };

      return { carouselData, selection };
    },
  };

  return filterOpt;
};
