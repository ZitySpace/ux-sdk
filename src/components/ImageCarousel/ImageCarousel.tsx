import React from 'react';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';
import { useCarouselStore } from '../../stores/carouselStore';
import PaginationBar from '../PaginationBar/PaginationBar';
import ImageTag from '../ImageTag';

const ImageCarousel = () => {
  const { useCarouselSizeQuery, useCarouselPageQuery } = useCarouselQueries();
  const sizeQuery = useCarouselSizeQuery();
  const pageQuery = useCarouselPageQuery();

  const getImageNames = useCarouselStore((s) => s.getNames);

  if (sizeQuery.isLoading || pageQuery.isLoading)
    return (
      <div className='h-full flex justify-center items-center'>loading...</div>
    );

  return (
    <div className='bg-gray-100 h-full flex flex-col justify-center shadow-lg rounded-md'>
      <div className='overflow-y-scroll h-full w-full'>
        <div className='grid grid-cols-5 md:grid-cols-10 gap-1 xl:gap-2 px-1 pt-1 pb-4 items-center justify-center'>
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
