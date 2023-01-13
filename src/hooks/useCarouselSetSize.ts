import { useQuery } from 'react-query';
import {
  SizeFilterBaseType,
  SizeFilterOnValueType,
} from '../stores/contextStore';
import { ContextStore } from '../stores/contextStore';
import { PagingStore } from '../stores/pagingStore';
import { useStore, StoreApi } from 'zustand';

export const useCarouselSetSize = ({
  contextStore,
  pagingStore,
}: {
  contextStore: StoreApi<ContextStore>;
  pagingStore: StoreApi<PagingStore>;
}) => {
  const setTotal = useStore(pagingStore, (s) => s.setTotal);

  const filter = useStore(contextStore, (s) => s.filter);

  const setSize = () =>
    useQuery(
      ['carouselSize', filter],
      () =>
        filter.dependsOnValue
          ? (filter.sizeFilter as SizeFilterOnValueType)(filter.value)
          : (filter.sizeFilter as SizeFilterBaseType)(),
      {
        onSuccess: (total) => setTotal(total),
        keepPreviousData: true,
        refetchOnWindowFocus: false, // this option is very important
      }
    );

  return setSize;
};
