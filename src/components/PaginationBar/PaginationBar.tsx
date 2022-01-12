import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronDoubleRightIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import React from 'react';

export interface PaginationBarProps {
  step: number;
  pos: number; // [0, total-1]
  total: number;
  setStep: Function;
  setPos: Function;
}

const PaginationBar = ({
  step,
  pos,
  total,
  setPos,
  setStep,
}: PaginationBarProps) => {
  const curPage = Math.floor(pos / step) + 1;
  const totPages = Math.floor((total - 1) / step) + 1 || 1;

  const toPrevPage = () => {
    const prevPos = Math.max(0, pos - step);
    setPos(prevPos);
  };

  const toFstPage = () => {
    setPos(0);
  };

  const toNextPage = () => {
    const nextPos = Math.min(step * (totPages - 1), pos + step);
    setPos(nextPos);
  };

  const toLstPage = () => {
    setPos(step * (totPages - 1));
  };

  const toPage = (evt: React.BaseSyntheticEvent) => {
    const v = parseInt(evt.target.value);
    if (isNaN(v)) return;
    const page = Math.max(1, Math.min(v, totPages));
    setPos(step * (page - 1));
  };

  const useStep = (evt: React.BaseSyntheticEvent) => {
    const v = parseInt(evt.target.value);
    if (isNaN(v)) return;
    const newStep = Math.max(1, Math.min(v, total));
    const newPos = Math.floor(pos / newStep) * newStep;
    setPos(newPos);
    setStep(newStep);
  };

  return (
    <div className='absolute bottom-0 flex justify-center p-1 w-full bg-gray-100'>
      <div className='flex justify-between w-full'>
        <div className='flex-1 inline-flex justify-start items-center md:pl-2'>
          <div className='text-gray-500 text-xs'>
            {total
              ? `${pos + 1} to ${Math.min(pos + step, total)} of ${total} items`
              : 'No items'}
          </div>
        </div>

        <div className='flex justify-center space-x-1 md:space-x-2 items-center'>
          <div className='flex text-gray-500'>
            <div
              onClick={toFstPage}
              className={`h-6 w-6 rounded-sm md:h-8 md:w-8 md:rounded-full mr-1 flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === 1
                  ? 'text-gray-400'
                  : 'hover:bg-indigo-600 hover:text-gray-100'
              }`}
            >
              <ChevronDoubleLeftIcon className='h-4 w-4' />
            </div>
            <div
              onClick={toPrevPage}
              className={`h-6 w-6 rounded-sm md:h-8 md:w-8 md:rounded-full flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === 1
                  ? 'text-gray-400'
                  : 'hover:bg-indigo-600 hover:text-gray-100'
              }`}
            >
              <ChevronLeftIcon className='h-4 w-4' />
            </div>
          </div>

          <input
            key={curPage}
            defaultValue={curPage}
            onBlur={toPage}
            onKeyPress={(evt: React.KeyboardEvent) => {
              evt.key === 'Enter' ? toPage(evt) : null;
            }}
            className='flex justify-center h-6 w-6 rounded-sm md:h-8 md:w-8 md:rounded-full text-center bg-indigo-600 text-gray-100 text-xs focus:outline-none'
          />

          <div className='flex text-gray-500'>
            <div
              onClick={toNextPage}
              className={`h-6 w-6 rounded-sm md:h-8 md:w-8 md:rounded-full mr-1 flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === totPages
                  ? 'text-gray-400'
                  : 'hover:bg-indigo-600 hover:text-gray-100'
              }`}
            >
              <ChevronRightIcon className='h-4 w-4' />
            </div>
            <div
              onClick={toLstPage}
              className={`h-6 w-6 rounded-sm md:h-8 md:w-8 md:rounded-full flex justify-center items-center bg-gray-200 cursor-pointer ${
                curPage === totPages
                  ? 'text-gray-400'
                  : 'hover:bg-indigo-600 hover:text-gray-100'
              }`}
            >
              <ChevronDoubleRightIcon className='h-4 w-4' />
            </div>
          </div>
        </div>

        <div className='hidden flex-1 md:inline-flex justify-end space-x-2 items-center pr-2'>
          <div className='hidden md:flex text-gray-500 items-center text-xs'>
            <input
              key={step}
              defaultValue={step}
              onBlur={useStep}
              onKeyPress={(evt: React.KeyboardEvent) => {
                evt.key === 'Enter' ? useStep(evt) : null;
              }}
              className='h-8 w-8 flex justify-center items-center mr-1 rounded-full text-center bg-gray-200 text-xs focus:outline-none'
            />
            items / page
          </div>

          <div className='hidden md:flex text-gray-500 items-center text-xs'>
            total
            <div className='h-8 w-8 mx-1 flex justify-center items-center rounded-full bg-gray-200 cursor-not-allowed text-xs'>
              {totPages}
            </div>
            pages
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationBar;
