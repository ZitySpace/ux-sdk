import React, { useEffect } from 'react';
import { useCarouselStore } from '../stores/carouselStore';
import { usePagingStore } from '../stores/pagingStore';
import PaginationBar from './PaginationBar';
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

  const imageNames = useStore(useCarouselStore(carouselStoreName), (s) =>
    s.getNames()
  );

  useEffect(() => {
    setStep(nItems);
  }, []);

  // hack so tailwind generate these utilities cuz dynamic Components.length
  // won't generate them unless in jit mode
  const _ = ['grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5'];

  return (
    <div className='bg-gray-100 h-full flex flex-col text-xs shadow-lg rounded-md select-none'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>{title}</span>
      </div>
      <div className='overflow-y-scroll h-full w-full @container'>
        <div className='grid grid-cols-1 @3xl:grid-cols-2 gap-1 @7xl:gap-2 px-1 pt-1 pb-4 items-center justify-center'>
          {imageNames.map((name: string, i: number) => (
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
