import React from 'react';
import { useCarouselSizeQuery, useCarouselPageQuery } from '../../hooks';
import PaginationBar from '../PaginationBar/PaginationBar';

const ImageCarousel = () => {
  const sizeQuery = useCarouselSizeQuery();
  // const pageQuery = useCarouselPageQuery();

  return (
    <div className='bg-gray-100 flex-grow flex justify-center'>
      <div className='grid grid-cols-5 md:grid-cols-10 gap-1 xl:gap-2 px-1 pt-1 pb-4 items-center justify-center'></div>
      <PaginationBar />
    </div>
  );
};

export default ImageCarousel;
