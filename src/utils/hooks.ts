import { useQuery } from 'react-query';
import { usePagingStore } from '../stores/pagingStore';
import { useAPIs } from './apis';

export const useHooks = () => {
  const setTotal = usePagingStore((s) => s.setTotal);
  const { getImagesCount } = useAPIs();

  const useCarouselSizeQuery = () =>
    useQuery('carouselSize', getImagesCount, {
      onSuccess: (total) => {
        setTotal(total);
      },
      refetchOnWindowFocus: false, // this option is very important
    });

  const useCarouselPageQuery = (pos: number, step: number) =>
    useQuery(['carouselPage', pos, step], () => pos + step);

  return { useCarouselSizeQuery, useCarouselPageQuery };
};
