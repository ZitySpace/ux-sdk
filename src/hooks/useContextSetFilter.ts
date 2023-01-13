import { FilterProps, ContextStore } from '../stores/contextStore';
import { PagingStore } from '../stores/pagingStore';
import { useStore, StoreApi } from 'zustand';

export const useContextSetFilter = ({
  pagingStore,
  contextStore,
}: {
  pagingStore: StoreApi<PagingStore>;
  contextStore: StoreApi<ContextStore>;
}) => {
  const setFilterCore = useStore(contextStore, (s) => s.setFilter);
  const setPos = useStore(pagingStore, (s) => s.setPos);

  const setFilter = (filter: FilterProps) => {
    setFilterCore(filter);
    setPos(0);
  };

  return setFilter;
};
