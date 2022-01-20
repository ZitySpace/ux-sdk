import produce from 'immer';
import create, { State } from 'zustand';
import createContext from 'zustand/context';

interface DetectionProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category: string;
}

interface ImageProps {
  name: string;
  width?: number;
  height?: number;
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
}

interface InitCarouselStoreState extends State {
  carouselData: { [key: string]: ImageProps };
  selection: {
    selectable: boolean;
    selected: { [key: string]: boolean };
  };
}

const initCarouselStoreState: InitCarouselStoreState = {
  carouselData: {},
  selection: {
    selectable: true,
    selected: {},
  },
};

export const { Provider: CarouselStoreProvider, useStore: useCarouselStore } =
  createContext<CarouselStoreState>();

export const createCarouselStore = (
  initState: InitCarouselStoreState = initCarouselStoreState
) =>
  create<CarouselStoreState>((set) => ({
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
      toggleImageSelect: (name) =>
        set(
          produce((s) => {
            s.selection.selected[name] = !s.selection.selected[name];
          })
        ),
    },
  }));
