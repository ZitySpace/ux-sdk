import { useAPIStore } from './apiStore';
import { CarouselStoreData } from './carouselStore';

import { createContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { newUseStore } from './factory';

const {
  getImagesCount,
  getImagesMeta,
  getImagesCountByCategory,
  getImagesMetaByCategory,
} = useAPIStore().getState().apis;

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

export type FilterProps = {
  by: string | null;
  value?: any | any[] | null;
  dependsOnValue?: boolean;
  sizeFilter?: SizeFilterType;
  pageFilter?: PageFilterType;
};

interface StoreData {
  filter: FilterProps;
}

const storeDataDefault = {
  filter: {
    by: null,
    value: null,
    dependsOnValue: false,
    sizeFilter: getImagesCount,
    pageFilter: getImagesMeta,
  },
};

interface Store extends StoreData {
  setFilter: (p: FilterProps) => void;
}

const defaultFilterProps = (filter: FilterProps) =>
  filter.by === null
    ? {
        value: null,
        dependsOnValue: false,
        sizeFilter: getImagesCount,
        pageFilter: getImagesMeta,
      }
    : filter.by === 'Category'
    ? {
        dependsOnValue: true,
        sizeFilter: getImagesCountByCategory,
        pageFilter: getImagesMetaByCategory,
      }
    : {};

const createStoreFromData = (pdata: Partial<StoreData> = storeDataDefault) => {
  const data = { ...storeDataDefault, ...pdata };

  return createStore<Store>((set) => ({
    filter: {
      ...data.filter,
      ...defaultFilterProps(data.filter),
    },

    setFilter: (filter: FilterProps) => {
      set({
        filter: { ...filter, ...defaultFilterProps(filter) },
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
