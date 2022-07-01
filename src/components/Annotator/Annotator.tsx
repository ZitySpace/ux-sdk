import React from 'react';
import {
  Annotator as AnnotatorCore,
  RectLabel,
} from '@ZitySpace/react-annotate';
import { useCarouselStore } from '../../stores/carouselStore';
import { useAPIs } from '../../utils/apis';
import { useStore } from 'zustand';

const Annotator = ({
  carouselStoreName = '.carouselStore',
}: {
  carouselStoreName?: string;
}) => {
  const imagesList = useStore(useCarouselStore(carouselStoreName), (s) =>
    Object.values(s.carouselData).map((props) => ({
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
              })
          )
        : [],
    }))
  );

  const { getImage } = useAPIs();

  return (
    <div className='bg-gray-100 h-96 min-h-full flex flex-col text-xs shadow-lg rounded-md relative select-none'>
      <AnnotatorCore imagesList={imagesList} getImage={getImage} />
    </div>
  );
};

export default Annotator;
