import { useStore, StoreApi } from 'zustand';
import { DataframeStore } from '../../stores/dataframeStore';

export const useDataframeHooks = ({
  dataframeStore,
}: {
  dataframeStore: StoreApi<DataframeStore>;
}) => {
  const setDataframe = useStore(dataframeStore, (s) => s.setDataframe);

  return {
    setDataframe,
  };
};
