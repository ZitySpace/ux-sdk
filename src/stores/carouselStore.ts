import produce from 'immer';
import create, { State } from 'zustand';
import createContext from 'zustand/context';

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

interface CarouselStoreState extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
    toggleSelectable: () => void;
    toggleImageSelect: (name: string) => void;
    toggleSelectAll: () => void;
  };
  setStateData: (data: CarouselStoreStateData) => void;
  getNames: () => string[];
}

export interface CarouselStoreStateData extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
}

export const { Provider: CarouselStoreProvider, useStore: useCarouselStore } =
  createContext<CarouselStoreState>();

export const createCarouselStore = (
  initState: CarouselStoreStateData = {
    carouselData: {},
    selection: { selectable: true, selected: {} },
  }
) =>
  create<CarouselStoreState>((set, get) => ({
    carouselData: initState.carouselData,
    selection: {
      selectable: initState.selection.selectable,
      selected: initState.selection.selected,
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
    setStateData: (data: CarouselStoreStateData) =>
      set(
        produce((s) => {
          s.carouselData = data.carouselData;
          s.selection.selectable = data.selection.selectable;
          s.selection.selected = data.selection.selected;
        })
      ),
    getNames: () => Object.keys(get().carouselData),
  }));
