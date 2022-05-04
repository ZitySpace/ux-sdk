import { useQuery } from 'react-query';
import {
  SizeFilterBaseType,
  SizeFilterOnValueType,
  PageFilterBaseType,
  PageFilterOnValueType,
} from '../../stores/contextStore';
import { useStore, StoreApi } from 'zustand';
import { ContextStore } from '../../stores/contextStore';
import { PagingStore } from '../../stores/pagingStore';
import { CarouselStore } from '../../stores/carouselStore';

export const useCarouselQueries = ({
  contextStore,
  pagingStore,
  carouselStore,
}: {
  contextStore: StoreApi<ContextStore>;
  pagingStore: StoreApi<PagingStore>;
  carouselStore: StoreApi<CarouselStore>;
}) => {
  const [pos, step, setTotal] = useStore(pagingStore, (s) => [
    s.pos,
    s.step,
    s.setTotal,
  ]);

  const filtering = useStore(contextStore, (s) => s.filtering);

  const setCarouselData = useStore(carouselStore, (s) => s.setCarouselData);

  const useCarouselSizeQuery = () =>
    useQuery(
      ['carouselSize', filtering],
      () =>
        filtering.dependsOnValue
          ? (filtering.sizeFilter as SizeFilterOnValueType)(filtering.value)
          : (filtering.sizeFilter as SizeFilterBaseType)(),
      {
        onSuccess: (total) => setTotal(total),
        keepPreviousData: true,
        refetchOnWindowFocus: false, // this option is very important
      }
    );

  const useCarouselPageQuery = () =>
    useQuery(
      ['carouselPage', pos, step, filtering],
      () =>
        filtering.dependsOnValue
          ? (filtering.pageFilter as PageFilterOnValueType)(
              filtering.value,
              pos,
              step,
              'upload_time'
            )
          : (filtering.pageFilter as PageFilterBaseType)(
              pos,
              step,
              'upload_time'
            ),
      {
        onSuccess: (carouselStateData) => setCarouselData(carouselStateData),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  return {
    useCarouselSizeQuery,
    useCarouselPageQuery,
  };
};
