import { useAPIs } from '../utils/apis';
import { CarouselStoreData } from './carouselStore';

import { createContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { newUseStore } from './factory';

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
    | CarouselStoreData
    | Promise<CarouselStoreData>;
};

export type PageFilterOnValueType = {
  (value: any, pos: number, step: number, ...args: Array<any>):
    | CarouselStoreData
    | Promise<CarouselStoreData>;
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

interface StoreData {
  filtering: FilteringProps;
}

const storeDataDefault = {
  filtering: {
    by: null,
    value: null,
    dependsOnValue: false,
    sizeFilter: getImagesCount,
    pageFilter: getImagesMeta,
  },
};

interface Store extends StoreData {
  filtering: FilteringProps;
  setFiltering: (p: FilteringProps) => void;
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

const createStoreFromData = (pdata: Partial<StoreData> = storeDataDefault) => {
  const data = { ...storeDataDefault, ...pdata };

  return createStore<Store>((set) => ({
    filtering: {
      ...data.filtering,
      ...defaultFilterProps(data.filtering),
    },

    setFiltering: (filteringProps: FilteringProps) => {
      set({
        filtering: { ...filteringProps, ...defaultFilterProps(filteringProps) },
      });
    },
  }));
};

const storeDefault = createStoreFromData(storeDataDefault);
const StoreContext = createContext<StoreApi<Store>>(storeDefault);

const useStore = newUseStore<Store, StoreData>(
  createStoreFromData,
  storeDataDefault
);

export {
  StoreContext as ContextStoreContext,
  StoreData as ContextStoreData,
  storeDataDefault as ContextStoreDataDefault,
  Store as ContextStore,
  useStore as useContextStore,
};
