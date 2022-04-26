import create, { State } from 'zustand';
import createContext from 'zustand/context';
import { useAPIs } from '../utils/apis';
import { CarouselStoreStateData } from './carouselStore';

const {
  getImagesCount,
  getImagesMeta,
  getImagesCountByCategory,
  getImagesMetaByCategory,
} = useAPIs();

type sizeFilterType =
  | {
      (): number | Promise<number>;
    }
  | {
      (value: any): number | Promise<number>;
    };

type pageFilterType =
  | {
      (pos: number, step: number, ...args: Array<any>):
        | CarouselStoreStateData
        | Promise<CarouselStoreStateData>;
    }
  | {
      (value: any, pos: number, step: number, ...args: Array<any>):
        | CarouselStoreStateData
        | Promise<CarouselStoreStateData>;
    };

export type FilteringProps = {
  by: string | null;
  value?: any | any[];
  sizeFilter?: sizeFilterType;
  pageFilter?: pageFilterType;
};

interface ContextStoreState extends State {
  filtering: FilteringProps;
  setFiltering: (p: FilteringProps) => void;
}

interface ContextStoreStateData extends State {
  filtering: FilteringProps;
}

const defaultFilters = (filtering: FilteringProps) =>
  filtering.by === null
    ? {
        sizeFilter: getImagesCount,
        pageFilter: getImagesMeta,
      }
    : filtering.by === 'category'
    ? {
        sizeFilter: getImagesCountByCategory,
        pageFilter: getImagesMetaByCategory,
      }
    : {};

export const { Provider: ContextStoreProvider, useStore: useContextStore } =
  createContext<ContextStoreState>();

export const createContextStore = (
  initState: ContextStoreStateData = { filtering: { by: null, value: null } }
) =>
  create<ContextStoreState>((set) => ({
    filtering: initState.filtering,

    setFiltering: (filteringProps: FilteringProps) =>
      set({
        filtering: { ...defaultFilters(filteringProps), ...filteringProps },
      }),
  }));
