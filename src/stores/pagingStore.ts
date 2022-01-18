import create, { State } from 'zustand';
import createContext from 'zustand/context';

interface PagingStoreState extends State {
  pos: number;
  step: number;
  total: number;
  getCurPage: () => number;
  getTotPages: () => number;
  setPos: (p: number) => void;
  setStep: (d: number) => void;
  toPrevPage: () => void;
  toNextPage: () => void;
  toFstPage: () => void;
  toLstPage: () => void;
  toPage: (n: number) => void;
}

export const { Provider, useStore: usePagingStore } =
  createContext<PagingStoreState>();

export const createPagingStore = () =>
  create<PagingStoreState>((set, get) => ({
    pos: 0,
    step: 10,
    total: 100,

    getCurPage: () => Math.floor(get().pos / get().step) + 1,
    getTotPages: () => Math.floor((get().total - 1) / get().step) + 1 || 1,

    setPos: (p: number) => set({ pos: p }),
    setStep: (d: number) =>
      set((s) => {
        const newStep = Math.max(1, Math.min(d, s.total));
        const newPos = Math.floor(s.pos / newStep) * newStep;
        return { pos: newPos, step: newStep };
      }),

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
