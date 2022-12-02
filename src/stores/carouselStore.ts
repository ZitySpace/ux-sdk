import produce from 'immer';
import { createContext } from 'react';
import { createStore, State, StoreApi } from 'zustand';
import { newUseStore } from './factory';

interface DetectionProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category?: string;
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
  annotations?: DetectionProps[] | null;
}

interface StoreData extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
  switchOfFreshData?: boolean;
}

const storeDataDefault = {
  carouselData: {},
  selection: { selectable: false, selected: {} },
  switchOfFreshData: false,
};

interface Store extends State {
  carouselData: { [key: string]: ImageProps };
  switchOfFreshData: boolean;
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
    toggleSelectable: () => void;
    toggleImageSelect: (name: string) => void;
    toggleSelectAll: () => void;
  };
  setCarouselData: (data: StoreData) => void;
  getNames: () => string[];
  setImageData: (name: string, data: ImageProps) => void;
}

const createStoreFromData = (data: Partial<StoreData> = storeDataDefault) =>
  createStore<Store>((set, get) => ({
    carouselData: { ...storeDataDefault.carouselData, ...data.carouselData },
    switchOfFreshData:
      data.switchOfFreshData || storeDataDefault.switchOfFreshData,
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
          s.switchOfFreshData = !s.switchOfFreshData;
        })
      ),
    getNames: () => Object.keys(get().carouselData),
    setImageData: (name: string, data: ImageProps) =>
      set(
        produce((s) => {
          s.carouselData[name] = data;
        })
      ),
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
