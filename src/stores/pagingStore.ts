import { createContext } from 'react';
import { createStore, State, StoreApi } from 'zustand';
import { newUseStore } from './factory';

interface StoreData extends State {
  pos: number;
  step: number;
  total: number;
}

const storeDataDefault = {
  pos: 0,
  step: 10,
  total: 100,
};

interface Store extends StoreData {
  getCurPage: () => number;
  getTotPages: () => number;
  setPos: (p: number) => void;
  setStep: (d: number) => void;
  setTotal: (t: number) => void;
  toPrevPage: () => void;
  toNextPage: () => void;
  toFstPage: () => void;
  toLstPage: () => void;
  toPage: (n: number) => void;
}

const createStoreFromData = (data: Partial<StoreData> = storeDataDefault) =>
  createStore<Store>((set, get) => ({
    ...storeDataDefault,
    ...data,

    getCurPage: () => Math.floor(get().pos / get().step) + 1,
    getTotPages: () => Math.floor((get().total - 1) / get().step) + 1 || 1,

    setPos: (p: number) => set({ pos: p }),
    setStep: (d: number) =>
      set((s) => {
        const newStep = Math.max(1, Math.min(d, s.total));
        const newPos = Math.floor(s.pos / newStep) * newStep;
        return { pos: newPos, step: newStep };
      }),
    setTotal: (t: number) => set({ total: t }),

    toPrevPage: () => set((s) => ({ pos: Math.max(0, s.pos - s.step) })),
    toNextPage: () =>
      set((s) => ({
        pos: Math.min(s.step * (s.getTotPages() - 1), s.pos + s.step),
      })),

    toFstPage: () => set({ pos: 0 }),
    toLstPage: () => set((s) => ({ pos: s.step * (s.getTotPages() - 1) })),

    toPage: (n: number) =>
      set((s) => {
        const page = Math.max(1, Math.min(n, s.getTotPages()));
        return { pos: s.step * (page - 1) };
      }),
  }));

const storeDefault = createStoreFromData(storeDataDefault);
const StoreContext = createContext<StoreApi<Store>>(storeDefault);

const useStore = newUseStore<Store, StoreData>(
  createStoreFromData,
  storeDataDefault
);

export {
  StoreContext as PagingStoreContext,
  StoreData as PagingStoreData,
  storeDataDefault as pagingStoreDataDefault,
  Store as PagingStore,
  useStore as usePagingStore,
};
