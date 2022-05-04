import React, { useRef, useEffect } from 'react';
import { useContainerQueries } from '../../utils/hooks/useContainerQueries';
import {
  useCarouselStore,
  CarouselStoreDataDefault,
  CarouselStoreData,
} from '../../stores/carouselStore';
import ImageTag from '../ImageTag';
import { useStore } from 'zustand';

const ImageCarousel = ({
  storeName = '.carouselStore',
  storeInit = CarouselStoreDataDefault,
  resetOnFirstMount = false,
}: {
  storeName?: string;
  storeInit?: CarouselStoreData;
  resetOnFirstMount?: boolean;
}) => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  const store = useCarouselStore(
    storeName,
    storeInit,
    resetOnFirstMount && !mounted.current
  );

  const getImageNames = useStore(store, (s) => s.getNames);

  const { ref, observeCSS } = useContainerQueries();
  const _ = ['grid-cols-10', 'gap-2'];

  return (
    <div
      className='bg-gray-100 h-full flex flex-col text-xs shadow-lg rounded-md select-none'
      ref={ref}
    >
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>Image Carousel</span>
      </div>
      <div className='overflow-y-scroll h-full w-full'>
        <div
          className={
            'grid ' +
            observeCSS('grid-cols-5 md:grid-cols-10 gap-1 xl:gap-2') +
            ' px-1 pt-1 pb-4 items-center justify-center'
          }
        >
          {getImageNames().map((name: string, i: number) => (
            <ImageTag name={name} carouselStoreName={storeName} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
