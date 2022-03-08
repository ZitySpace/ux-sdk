import create, { State } from 'zustand';
import createContext from 'zustand/context';

export type FilteringProps = {
  by: string;
  value: string | string[];
} | null;

interface ContextStoreState extends State {
  filtering: FilteringProps;
  setFiltering: (p: FilteringProps) => void;
}

interface ContextStoreStateData extends State {
  filtering: FilteringProps;
}

export const { Provider: ContextStoreProvider, useStore: useContextStore } =
  createContext<ContextStoreState>();

export const createContextStore = (
  initState: ContextStoreStateData = { filtering: null }
) =>
  create<ContextStoreState>((set) => ({
    filtering: initState.filtering,

    setFiltering: (filteringProps: FilteringProps) =>
      set({ filtering: filteringProps }),
  }));
