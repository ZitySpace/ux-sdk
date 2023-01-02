import React from 'react';
import { useCarouselStore } from '../stores/carouselStore';
import ImageTag from './ImageTag';
import { useStore } from 'zustand';

const ImageCarousel = ({
  carouselStoreName = '.carouselStore',
}: {
  carouselStoreName?: string;
}) => {
  const imageNames = useStore(useCarouselStore(carouselStoreName), (s) =>
    s.getNames()
  );

  return (
    <div className='bg-gray-100 h-full flex flex-col text-xs shadow-lg rounded-md select-none'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>Image Carousel</span>
      </div>
      <div className='overflow-y-scroll h-full w-full @container'>
        <div className='grid grid-cols-5 @3xl:grid-cols-10 gap-1 @7xl:gap-2 px-1 pt-1 pb-4 items-center justify-center'>
          {imageNames.map((name: string, i: number) => (
            <ImageTag
              name={name}
              carouselStoreName={carouselStoreName}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
