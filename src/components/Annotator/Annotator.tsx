import React from 'react';
import {
  Annotator as AnnotatorCore,
  BoxLabel,
  ImageData,
} from '@ZitySpace/react-annotate';
import { ImageProps, useCarouselStore } from '../../stores/carouselStore';
import { useAPIs } from '../../utils/apis';
import { useStore } from 'zustand';

const Annotator = ({
  carouselStoreName = '.carouselStore',
}: {
  carouselStoreName?: string;
}) => {
  const [carouselData, setImageData] = useStore(
    useCarouselStore(carouselStoreName),
    (s) => [s.carouselData, s.setImageData]
  );

  const imagesList = Object.values(carouselData).map((props: ImageProps) => ({
    ...props,
    annotations: props.annotations
      ? props.annotations.map(
          (anno, id) =>
            new BoxLabel({
              id: id,
              x: anno.x,
              y: anno.y,
              w: anno.w,
              h: anno.h,
              category: anno.category!,
              timestamp: anno.timestamp_z,
              hash: anno.unique_hash_z,
            })
        )
      : [],
  }));

  const onSave = (
    curImageData: ImageData,
    curIndex: number,
    imagesList: ImageData[]
  ) => {
    setImageData(curImageData.name, {
      ...carouselData[curImageData.name],
      annotations: (curImageData.annotations as BoxLabel[]).map((anno) => {
        const {
          category,
          timestamp: timestamp_z,
          hash: unique_hash_z,
          x,
          y,
          w,
          h,
        } = anno.toImageCoordSystem(false);
        return { category, timestamp_z, unique_hash_z, x, y, w, h };
      }),
    });
  };

  const { getImage } = useAPIs();

  return (
    <div className='bg-gray-100 h-96 min-h-full flex flex-col text-xs shadow-lg rounded-md relative select-none'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>Annotator</span>
      </div>

      {imagesList.length > 0 && (
        <AnnotatorCore
          imagesList={imagesList}
          getImage={getImage}
          onSave={onSave}
          onSwitch={onSave}
        />
      )}
    </div>
  );
};

export default Annotator;
