import create, { State } from 'zustand';
import createContext from 'zustand/context';

enum FilteringOption {
  Category = 'Category',
  ImageNames = 'ImageNames',
}

export interface FilteringProps {
  by: FilteringOption;
  value: string | string[];
}

interface ContextStoreState extends State {
  filtering: null | FilteringProps;
  setFiltering: (p: FilteringProps) => void;
}

interface ContextStoreStateData extends State {
  filtering: null | FilteringProps;
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
