import React from 'react';
import ImageTag from './ImageTag';
import { useAtomValue } from 'jotai';
import { carouselDataAtom } from '../atoms';

const ImageCarousel = ({
  title = 'Image Carousel',
  hideTitle = false,
  flat = true,
  rounded = false,
}: {
  title?: string;
  hideTitle?: boolean;
  flat?: boolean;
  rounded?: boolean;
}) => {
  const carouselData = useAtomValue(carouselDataAtom);
  const imageNames = Object.keys(carouselData.carouselData);

  return (
    <div
      className={`us-bg-gray-100 us-h-full us-flex us-flex-col us-text-xs ${
        flat ? '' : 'us-shadow-lg'
      } ${rounded ? 'us-rounded-md' : ''} us-select-none`}
    >
      {!hideTitle && (
        <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2'>
          <span>{title}</span>
        </div>
      )}
      <div className='us-overflow-y-scroll us-h-full us-w-full us-@container'>
        <div className='us-grid us-grid-cols-5 @3xl:us-grid-cols-10 us-gap-1 @7xl:us-gap-2 us-px-1 us-pt-1 us-pb-4 us-items-center us-justify-center'>
          {imageNames.map((name: string, i: number) => (
            <ImageTag name={name} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
