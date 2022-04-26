import { useQuery } from 'react-query';
import { usePagingStore } from '../../stores/pagingStore';
import { useCarouselStore } from '../../stores/carouselStore';
import {
  useContextStore,
  SizeFilterBaseType,
  SizeFilterOnValueType,
  PageFilterBaseType,
  PageFilterOnValueType,
} from '../../stores/contextStore';

export const useCarouselQueries = () => {
  const [pos, step, setTotal] = usePagingStore((s) => [
    s.pos,
    s.step,
    s.setTotal,
  ]);

  const filtering = useContextStore((s) => s.filtering);

  const setCarouselStateData = useCarouselStore((s) => s.setStateData);

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
        onSuccess: (carouselStateData) =>
          setCarouselStateData(carouselStateData),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  return {
    useCarouselSizeQuery,
    useCarouselPageQuery,
  };
};
