import React, { useEffect } from 'react';
import { useContainerQueries } from '../../utils/hooks/useContainerQueries';
import { useCarouselStore } from '../../stores/carouselStore';
import { usePagingStore } from '../../stores/pagingStore';
import PaginationBar from '../PaginationBar';
import { useStore } from 'zustand';

interface ComponentProps {
  name: string;
}

const Comparer = ({
  Components,
  nItems = 6,
  title = 'Comparer',
  pagingStoreName = '.pagingStore',
  carouselStoreName = '.carouselStore',
}: {
  Components: React.FC<ComponentProps>[];
  nItems?: number;
  title?: string;
  pagingStoreName?: string;
  carouselStoreName?: string;
}) => {
  const setStep = useStore(usePagingStore(pagingStoreName), (s) => s.setStep);

  const getImageNames = useStore(
    useCarouselStore(carouselStoreName),
    (s) => s.getNames
  );

  useEffect(() => {
    setStep(nItems);
  }, []);

  const { ref, observeCSS } = useContainerQueries();
  const _ = ['grid-cols-2', 'gap-2'];

  return (
    <div
      className='bg-gray-100 h-full flex flex-col text-xs shadow-lg rounded-md select-none'
      ref={ref}
    >
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>{title}</span>
      </div>
      <div className='overflow-y-scroll h-full w-full'>
        <div
          className={
            'grid ' +
            observeCSS('grid-cols-1 md:grid-cols-2 gap-1 xl:gap-2') +
            ' px-1 pt-1 pb-4 items-center justify-center'
          }
        >
          {getImageNames().map((name: string, i: number) => (
            <div
              key={i}
              className={`grid grid-cols-${Components.length} gap-x-1 border-2 border-indigo-400/50 rounded-lg p-0.5`}
            >
              {Components.map(
                (Component: React.FC<ComponentProps>, j: number) => (
                  <Component name={name} key={'c-' + j} />
                )
              )}
            </div>
          ))}
        </div>
      </div>
      <PaginationBar pagingStoreName={pagingStoreName} />
    </div>
  );
};

export default Comparer;
