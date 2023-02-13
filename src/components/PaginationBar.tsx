import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import React from 'react';
import shallow from 'zustand/shallow';
import { useStore } from 'zustand';
import { usePagingStore } from '../stores/pagingStore';

const PaginationBar = ({
  pagingStoreName = '.pagingStore',
}: {
  pagingStoreName?: string;
}) => {
  const [
    pos,
    step,
    total,
    getCurPage,
    getTotPages,
    setStep,
    toFstPage,
    toLstPage,
    toPrevPage,
    toNextPage,
    toPage,
  ] = useStore(
    usePagingStore(pagingStoreName),
    (s) => [
      s.pos,
      s.step,
      s.total,
      s.getCurPage,
      s.getTotPages,
      s.setStep,
      s.toFstPage,
      s.toLstPage,
      s.toPrevPage,
      s.toNextPage,
      s.toPage,
    ],
    shallow
  );

  const curPage = getCurPage();
  const totPages = getTotPages();

  const toPageInputHandler = (evt: React.BaseSyntheticEvent) => {
    const v = parseInt(evt.target.value);
    if (isNaN(v)) return;
    toPage(v);
  };

  const setStepInputHandler = (evt: React.BaseSyntheticEvent) => {
    const v = parseInt(evt.target.value);
    if (isNaN(v)) return;
    setStep(v);
  };

  return (
    <div className='us-flex us-justify-center us-py-1 us-w-full us-bg-gray-100'>
      <div className='us-flex us-justify-between us-w-full us-@container'>
        <div className='us-flex-1 us-inline-flex us-justify-start us-items-center @3xl:us-pl-2 '>
          <div className='us-text-gray-500 us-text-xs'>
            {total
              ? `${pos + 1} to ${Math.min(pos + step, total)} of ${total} items`
              : 'No items'}
          </div>
        </div>

        <div className='us-flex us-justify-center us-space-x-1 @3xl:us-space-x-2 us-items-center'>
          <div className='us-flex us-text-gray-500'>
            <div
              onClick={toFstPage}
              className={`us-h-6 us-w-6 us-rounded-sm @3xl:us-h-8 @3xl:us-w-8 @3xl:us-rounded-full us-mr-1 us-flex us-justify-center us-items-center us-bg-gray-200 us-cursor-pointer ${
                curPage === 1
                  ? 'us-text-gray-400'
                  : 'hover:us-bg-indigo-600 hover:us-text-gray-100'
              }`}
            >
              <ChevronDoubleLeftIcon className='us-h-4 us-w-4' />
            </div>
            <div
              onClick={toPrevPage}
              className={`
                'us-h-6 us-w-6 us-rounded-sm @3xl:us-h-8 @3xl:us-w-8 @3xl:us-rounded-full us-flex us-justify-center us-items-center us-bg-gray-200 us-cursor-pointer ${
                  curPage === 1
                    ? 'us-text-gray-400'
                    : 'hover:us-bg-indigo-600 hover:us-text-gray-100'
                }`}
            >
              <ChevronLeftIcon className='us-h-4 us-w-4' />
            </div>
          </div>

          <input
            key={curPage}
            defaultValue={curPage}
            onBlur={toPageInputHandler}
            onKeyPress={(evt: React.KeyboardEvent) => {
              evt.key === 'Enter' ? toPageInputHandler(evt) : null;
            }}
            className='us-flex us-justify-center us-h-6 us-w-6 us-rounded-sm @3xl:us-h-8 @3xl:us-w-8 @3xl:us-rounded-full us-text-center us-bg-indigo-600 us-text-gray-100 us-text-xs focus:us-outline-none'
          />

          <div className='us-flex us-text-gray-500'>
            <div
              onClick={toNextPage}
              className={`us-h-6 us-w-6 us-rounded-sm @3xl:us-h-8 @3xl:us-w-8 @3xl:us-rounded-full us-mr-1 us-flex us-justify-center us-items-center us-bg-gray-200 us-cursor-pointer ${
                curPage === totPages
                  ? 'us-text-gray-400'
                  : 'hover:us-bg-indigo-600 hover:us-text-gray-100'
              }`}
            >
              <ChevronRightIcon className='us-h-4 us-w-4' />
            </div>
            <div
              onClick={toLstPage}
              className={`us-h-6 us-w-6 us-rounded-sm @3xl:us-h-8 @3xl:us-w-8 @3xl:us-rounded-full us-flex us-justify-center us-items-center us-bg-gray-200 us-cursor-pointer ${
                curPage === totPages
                  ? 'us-text-gray-400'
                  : 'hover:us-bg-indigo-600 hover:us-text-gray-100'
              }`}
            >
              <ChevronDoubleRightIcon className='us-h-4 us-w-4' />
            </div>
          </div>
        </div>

        <div className='us-hidden @3xl:us-inline-flex us-flex-1 us-justify-end us-space-x-2 us-items-center us-pr-2'>
          <div className='us-hidden @3xl:us-flex us-text-gray-500 us-items-center us-text-xs'>
            <input
              key={step}
              defaultValue={step}
              onBlur={setStepInputHandler}
              onKeyPress={(evt: React.KeyboardEvent) => {
                evt.key === 'Enter' ? setStepInputHandler(evt) : null;
              }}
              className='us-h-8 us-w-8 us-flex us-justify-center us-items-center us-mr-1 us-rounded-full us-text-center us-bg-gray-200 us-text-xs focus:us-outline-none'
            />
            items / page
          </div>

          <div className='us-hidden @3xl:us-flex us-text-gray-500 us-items-center us-text-xs'>
            total
            <div className='us-h-8 us-w-8 us-mx-1 us-flex us-justify-center us-items-center us-rounded-full us-bg-gray-200 us-cursor-not-allowed us-text-xs'>
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
