import React from 'react';
import {
  Annotator as AnnotatorCore,
  RectLabel,
  ImageData,
} from '@ZitySpace/react-annotate';
import { useCarouselStore } from '../../stores/carouselStore';
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

  const imagesList = Object.values(carouselData).map((props) => ({
    ...props,
    annotations: props.annotations
      ? props.annotations.map(
          (anno, id) =>
            new RectLabel({
              id: id,
              x: anno.x,
              y: anno.y,
              w: anno.w,
              h: anno.h,
              category: anno.category,
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
      annotations: (curImageData.annotations as RectLabel[]).map((anno) => ({
        category: anno.category,
        timestamp_z: anno.timestamp,
        unique_hash_z: anno.hash,
        x: Math.round((anno.rect.x - anno.offset.x) / anno.scale),
        y: Math.round((anno.rect.y - anno.offset.y) / anno.scale),
        w: Math.round(anno.rect.w / anno.scale),
        h: Math.round(anno.rect.h / anno.scale),
      })),
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
