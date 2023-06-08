import React, { useEffect } from 'react';
import PaginationBar from './PaginationBar.Jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import { stepAtom, carouselDataAtom } from '../atoms';

interface ComponentProps {
  name: string;
}

const Comparer = ({
  Components,
  nItems = 6,
  title = 'Comparer',
}: {
  Components: React.FC<ComponentProps>[];
  nItems?: number;
  title?: string;
}) => {
  const setStep = useSetAtom(stepAtom);
  const carouselData = useAtomValue(carouselDataAtom);
  const imageNames = Object.keys(carouselData.carouselData);

  useEffect(() => {
    setStep(nItems);
  }, []);

  // hack so tailwind generate these utilities cuz dynamic Components.length
  // won't generate them unless in jit mode
  const _ = [
    'us-grid-cols-2',
    'us-grid-cols-3',
    'us-grid-cols-4',
    'us-grid-cols-5',
  ];

  return (
    <div className='us-bg-gray-100 us-h-full us-flex us-flex-col us-text-xs us-shadow-lg us-rounded-md us-select-none'>
      <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2'>
        <span>{title}</span>
      </div>
      <div className='us-overflow-y-scroll us-h-full us-w-full us-@container'>
        <div className='us-grid us-grid-cols-1 @3xl:us-grid-cols-2 us-gap-1 @7xl:us-gap-2 us-px-1 us-pt-1 us-pb-4 us-items-center us-justify-center'>
          {imageNames.map((name: string, i: number) => (
            <div
              key={i}
              className={`us-grid us-grid-cols-${Components.length} us-gap-x-1 us-border-2 us-border-indigo-400/50 us-rounded-lg us-p-0.5`}
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
      <PaginationBar />
    </div>
  );
};

export default Comparer;
