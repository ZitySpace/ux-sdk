import React, { useRef } from 'react';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';
import { useContainerQueries } from '../../utils/hooks/useContainerQueries';
import { useCarouselStore } from '../../stores/carouselStore';
import PaginationBar from '../PaginationBar/PaginationBar';
import ImageTag from '../ImageTag';

const ImageCarousel = () => {
  const { useCarouselSizeQuery, useCarouselPageQuery } = useCarouselQueries();
  const sizeQuery = useCarouselSizeQuery();
  const pageQuery = useCarouselPageQuery();

  const getImageNames = useCarouselStore((s) => s.getNames);

  const { ref, observeCSS } = useContainerQueries();
  const _ = ['grid-cols-10', 'gap-2'];

  if (sizeQuery.isLoading || pageQuery.isLoading)
    return (
      <div className='h-full flex justify-center items-center' ref={ref}>
        loading...
      </div>
    );

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
            <ImageTag name={name} key={i} />
          ))}
        </div>
      </div>
      <PaginationBar />
    </div>
  );
};

export default ImageCarousel;
