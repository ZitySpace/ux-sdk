import React, { useEffect, useRef, useReducer } from 'react';
import {
  Annotator as AnnotatorCore,
  ImageData,
  LabelType,
} from '@zityspace/react-annotate';
import { useCarouselStore } from '../stores/carouselStore';
import { useAPIs } from '../hooks';
import { useStore } from 'zustand';

const Annotator = ({
  carouselStoreName = '.carouselStore',
}: {
  carouselStoreName?: string;
}) => {
  const [carouselData, setImageData, switchOfFreshData] = useStore(
    useCarouselStore(carouselStoreName),
    (s) => [s.carouselData, s.setImageData, s.switchOfFreshData]
  );

  const imagesListRef: React.MutableRefObject<ImageData[]> = useRef<
    ImageData[]
  >([]);

  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  // hack: use switchOfFreshData to differentiate two cases:
  // 1. carouselData mutated by setCarouselData due to
  // fetching data of a new page or filtering condition change
  // 2. carouselData mutated by setImageData due to onSave
  // triggered by react-annotate Annotator component
  // so use imagesListRef instead of imagesList to only re-render
  // Annotator for the first case
  useEffect(() => {
    imagesListRef.current = Object.values(carouselData).map((props) => ({
      ...props,
      annotations: props.annotations
        ? props.annotations.map((anno) => ({
            ...anno,
            type: LabelType.Box as const,
            category: anno.category!,
            timestamp: anno.timestamp_z,
            hash: anno.unique_hash_z,
          }))
        : [],
    }));

    forceUpdate();
  }, [switchOfFreshData]);

  const { getImage, saveAnnotations } = useAPIs();

  const onSave = async (curImageData: ImageData) => {
    await saveAnnotations(curImageData);
    setImageData(curImageData.name, {
      ...carouselData[curImageData.name],
      annotations: curImageData.annotations.map((anno) => {
        const {
          x,
          y,
          w,
          h,
          category,
          timestamp: timestamp_z,
          hash: unique_hash_z,
        } = anno as {
          x: number;
          y: number;
          w: number;
          h: number;
          category: string;
          timestamp: string;
          hash: string;
        };
        return { x, y, w, h, category, timestamp_z, unique_hash_z };
      }),
    });
    return true;
  };

  return (
    <div className='us-bg-gray-100 us-h-96 us-min-h-full us-flex us-flex-col us-text-xs us-shadow-lg us-rounded-md us-relative us-select-none'>
      <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2'>
        <span>Annotator</span>
      </div>

      {imagesListRef.current.length > 0 && (
        <AnnotatorCore
          imagesList={imagesListRef.current}
          getImage={getImage}
          onSave={onSave}
          onError={(m: string, c: any) => {
            console.log(m, c);
          }}
          onAddCategory={async (c: string) => {
            console.log('add new category ', c);
            return true;
          }}
          onRenameCategory={async (o: string, n: string, t?: string) => {
            console.log(o, ' -> ', n, ' @ ', t);
            return true;
          }}
        />
      )}
    </div>
  );
};

export default Annotator;
