import { useQuery } from 'react-query';
import { usePagingStore } from '../stores/pagingStore';

const setTotal = usePagingStore.getState().setTotal;

export const useCarouselSizeQuery = () =>
  useQuery('carouselSize', () => 123, {
    onSuccess: (total) => setTotal(total),
  });

export const useCarouselPageQuery = (pos: number, step: number) =>
  useQuery(['carouselPage', pos, step], () => pos + step);
