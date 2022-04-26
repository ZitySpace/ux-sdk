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

export type SizeFilterBaseType = {
  (): number | Promise<number>;
};

export type SizeFilterOnValueType = {
  (value: any): number | Promise<number>;
};

export type PageFilterBaseType = {
  (pos: number, step: number, ...args: Array<any>):
    | CarouselStoreStateData
    | Promise<CarouselStoreStateData>;
};

export type PageFilterOnValueType = {
  (value: any, pos: number, step: number, ...args: Array<any>):
    | CarouselStoreStateData
    | Promise<CarouselStoreStateData>;
};

type SizeFilterType = SizeFilterBaseType | SizeFilterOnValueType;

type PageFilterType = PageFilterBaseType | PageFilterOnValueType;

export type FilteringProps = {
  by: string | null;
  value?: any | any[] | null;
  dependsOnValue?: boolean;
  sizeFilter?: SizeFilterType;
  pageFilter?: PageFilterType;
};

interface ContextStoreState extends State {
  filtering: FilteringProps;
  setFiltering: (p: FilteringProps) => void;
}

interface ContextStoreStateData extends State {
  filtering: FilteringProps;
}

const defaultFilterProps = (filtering: FilteringProps) =>
  filtering.by === null
    ? {
        value: null,
        dependsOnValue: false,
        sizeFilter: getImagesCount,
        pageFilter: getImagesMeta,
      }
    : filtering.by === 'Category'
    ? {
        dependsOnValue: true,
        sizeFilter: getImagesCountByCategory,
        pageFilter: getImagesMetaByCategory,
      }
    : {};

export const { Provider: ContextStoreProvider, useStore: useContextStore } =
  createContext<ContextStoreState>();

export const createContextStore = (
  initState: ContextStoreStateData = {
    filtering: {
      by: null,
      value: null,
      dependsOnValue: false,
      sizeFilter: getImagesCount,
      pageFilter: getImagesMeta,
    },
  }
) =>
  create<ContextStoreState>((set) => ({
    filtering: {
      ...initState.filtering,
      ...defaultFilterProps(initState.filtering),
    },

    setFiltering: (filteringProps: FilteringProps) => {
      set({
        filtering: { ...filteringProps, ...defaultFilterProps(filteringProps) },
      });
    },
  }));
