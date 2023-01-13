import { useQuery } from 'react-query';
import {
  PageFilterBaseType,
  PageFilterOnValueType,
} from '../stores/contextStore';
import { ContextStore } from '../stores/contextStore';
import { PagingStore } from '../stores/pagingStore';
import { CarouselStore } from '../stores/carouselStore';
import { useStore, StoreApi } from 'zustand';

export const useCarouselSetPage = ({
  contextStore,
  pagingStore,
  carouselStore,
}: {
  contextStore: StoreApi<ContextStore>;
  pagingStore: StoreApi<PagingStore>;
  carouselStore: StoreApi<CarouselStore>;
}) => {
  const [pos, step] = useStore(pagingStore, (s) => [s.pos, s.step]);

  const filter = useStore(contextStore, (s) => s.filter);

  const setCarouselData = useStore(carouselStore, (s) => s.setCarouselData);

  const setPage = () =>
    useQuery(
      ['carouselPage', pos, step, filter],
      () =>
        filter.dependsOnValue
          ? (filter.pageFilter as PageFilterOnValueType)(
              filter.value,
              pos,
              step,
              'upload_time'
            )
          : (filter.pageFilter as PageFilterBaseType)(pos, step, 'upload_time'),
      {
        onSuccess: (carouselStateData) => setCarouselData(carouselStateData),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  return setPage;
};
