import { useContextStore, FilteringProps } from '../../stores/contextStore';
import { usePagingStore } from '../../stores/pagingStore';
import { useQueryClient } from 'react-query';

const useHooksExported = () => {
  const { setFiltering: setFilteringCore } = useContextStore((s) => ({
    setFiltering: s.setFiltering,
  }));
  const setPos = usePagingStore((s) => s.setPos);
  const queryClient = useQueryClient();

  const setFiltering = (filteringProps: FilteringProps) => {
    setFilteringCore(filteringProps);
    setPos(0);
  };

  return { setFiltering };
};

export default useHooksExported;
