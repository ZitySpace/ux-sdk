import { FilteringProps, ContextStore } from '../../stores/contextStore';
import { PagingStore } from '../../stores/pagingStore';
import { useQueryClient } from 'react-query';
import { useStore, StoreApi } from 'zustand';

const useHooksExported = ({
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

export default useHooksExported;
