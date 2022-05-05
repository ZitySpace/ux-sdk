import produce from 'immer';
import { createContext } from 'react';
import { createStore, State, StoreApi } from 'zustand';
import { newUseStore } from './factory';

interface StoreData extends State {
  header: string[];
  data: any[][];
}

const storeDataDefault = {
  header: [],
  data: [],
};

interface Store extends StoreData {
  selected: boolean[];
  setDataframe: (df: StoreData | null) => void;
  toggleSelect: (i: number) => void;
  toggleSelectSlice: (i: number, step: number) => void;
}

const createStoreFromData = (pdf: Partial<StoreData> = storeDataDefault) => {
  const df = { ...storeDataDefault, ...pdf };

  return createStore<Store>((set) => ({
    ...df,
    selected: Array(df.data.length).fill(false),
    setDataframe: (df: StoreData | null) => {
      const dfNew = df ? df : storeDataDefault;
      set({ ...dfNew, selected: Array(dfNew.data.length).fill(false) });
    },
    toggleSelect: (i: number) =>
      set(
        produce((s) => {
          s.selected[i] = !s.selected[i];
        })
      ),
    toggleSelectSlice: (i: number, step: number) =>
      set(
        produce((s) => {
          const allSelected = !s.selected.slice(i, i + step).includes(false);
          s.selected.splice(i, step, ...Array(step).fill(!allSelected));
        })
      ),
  }));
};

const storeDefault = createStoreFromData(storeDataDefault);
const StoreContext = createContext<StoreApi<Store>>(storeDefault);

const useStore = newUseStore<Store, StoreData>(
  createStoreFromData,
  storeDataDefault
);

export {
  StoreContext as DataframeStoreContext,
  StoreData as DataframeStoreData,
  storeDataDefault as dataframeStoreDataDefault,
  Store as DataframeStore,
  useStore as useDataframeStore,
};
