import create, { State } from 'zustand';

interface PagingStoreState extends State {
  pos: number;
  step: number;
  total: number;
  curPage: number;
  totPages: number;
}

export const usePagingStore = create<PagingStoreState>((set, get) => ({
  pos: 0,
  step: 10,
  total: 100,

  curPage: Math.floor(get().pos / get().step) + 1,
  totPages: Math.floor((get().total - 1) / get().step) + 1 || 1,

  setPos: (p: number) => set({ pos: p }),
  setStep: (d: number) =>
    set((s) => {
      const newStep = Math.max(1, Math.min(d, s.total));
      const newPos = Math.floor(s.pos / newStep) * newStep;
      return { pos: newPos, step: newStep };
    }),

  toPrevpage: () => set((s) => ({ pos: Math.max(0, s.pos - s.step) })),
  toNextPage: () =>
    set((s) => ({ pos: Math.min(s.step * (s.totPages - 1), s.pos + s.step) })),

  toFstPage: () => set({ pos: 0 }),
  toLstPage: () => set((s) => ({ pos: s.step * (s.totPages - 1) })),

  toPage: (n: number) =>
    set((s) => {
      const page = Math.max(1, Math.min(n, s.totPages));
      return { pos: s.step * (page - 1) };
    }),
}));
