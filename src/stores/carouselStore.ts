import produce from 'immer';
import create, { State } from 'zustand';

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
  };
  setStateData: (data: CarouselStoreStateData) => void;
}

export interface CarouselStoreStateData extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
}

export const useCarouselStore = create<CarouselStoreState>((set) => ({
  carouselData: {},
  selection: {
    selectable: true,
    selected: {},
    toggleSelectable: () =>
      set(
        produce((s) => {
          s.selection.selectable = !s.selection.selectable;
        })
      ),
    toggleImageSelect: (name) =>
      set(
        produce((s) => {
          s.selection.selected[name] = !s.selection.selected[name];
        })
      ),
  },
  setStateData: (data: CarouselStoreStateData) =>
    set(produce((s) => ({ ...s, ...data }))),
}));
