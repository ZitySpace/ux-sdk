import produce from 'immer';
import { createContext } from 'react';
import { createStore, State, StoreApi } from 'zustand';
import { newUseStore } from './factory';

interface DetectionProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category: string;
  timestamp_z?: string;
  unique_hash_z?: string;
}

export interface ImageProps {
  id?: number;
  name: string;
  file_size?: number;
  image_area?: number;
  height?: number;
  width?: number;
  upload_time?: string;
  annotations: DetectionProps[];
}

interface StoreData extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
}

const storeDataDefault = {
  carouselData: {},
  selection: { selectable: false, selected: {} },
};

interface Store extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
    toggleSelectable: () => void;
    toggleImageSelect: (name: string) => void;
    toggleSelectAll: () => void;
  };
  setCarouselData: (data: StoreData) => void;
  getNames: () => string[];
}

const createStoreFromData = (data: Partial<StoreData> = storeDataDefault) =>
  createStore<Store>((set, get) => ({
    carouselData: { ...storeDataDefault.carouselData, ...data.carouselData },
    selection: {
      selectable:
        data.selection?.selectable || storeDataDefault.selection.selectable,
      selected: {
        ...storeDataDefault.selection.selected,
        ...data.selection?.selected,
      },
      toggleSelectable: () =>
        set(
          produce((s) => {
            s.selection.selectable = !s.selection.selectable;
          })
        ),
      toggleImageSelect: (name: string) =>
        set(
          produce((s) => {
            s.selection.selected[name] = !s.selection.selected[name];
          })
        ),
      toggleSelectAll: () =>
        set(
          produce((s) => {
            const selected = s.selection.selected;
            const allSelected = !Object.values(selected).includes(false);
            Object.keys(selected).forEach(
              (name) => (selected[name] = !allSelected)
            );
          })
        ),
    },
    setCarouselData: (data: StoreData) =>
      set(
        produce((s) => {
          s.carouselData = data.carouselData;
          s.selection.selected = data.selection.selected;
        })
      ),
    getNames: () => Object.keys(get().carouselData),
  }));

const storeDefault = createStoreFromData(storeDataDefault);
const StoreContext = createContext<StoreApi<Store>>(storeDefault);

const useStore = newUseStore<Store, StoreData>(
  createStoreFromData,
  storeDataDefault
);

export {
  StoreContext as CarouselStoreContext,
  StoreData as CarouselStoreData,
  storeDataDefault as CarouselStoreDataDefault,
  Store as CarouselStore,
  useStore as useCarouselStore,
};
