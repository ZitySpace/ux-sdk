import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import React from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

const posAtom = atom<number>(0);
const stepAtom = atom<number>(10);
const totAtom = atom<number>(100);
const curPageAtom = atom((get) => Math.floor(get(posAtom) / get(stepAtom)) + 1);
const totPagesAtom = atom(
  (get) => Math.floor((get(totAtom) - 1) / get(stepAtom)) + 1 || 1
);
const toPrevPageAtom = atom(null, (get, set) => {
  set(posAtom, Math.max(get(posAtom) - get(stepAtom), 0));
});
const toNextPageAtom = atom(null, (get, set) => {
  set(
    posAtom,
    Math.min(
      get(posAtom) + get(stepAtom),
      get(stepAtom) * (get(totPagesAtom) - 1)
    )
  );
});
const toFstPageAtom = atom(null, (get, set) => {
  set(posAtom, 0);
});
const toLstPageAtom = atom(null, (get, set) => {
  set(posAtom, get(stepAtom) * (get(totPagesAtom) - 1));
});
const toPageAtom = atom(null, (get, set, n: number) => {
  set(
    posAtom,
    get(stepAtom) * (Math.max(1, Math.min(n, get(totPagesAtom))) - 1)
  );
});

const PaginationBar = () => {
  const [pos] = useAtom(posAtom);
  const [step, setStep] = useAtom(stepAtom);
  const [total] = useAtom(totAtom);

  const curPage = useAtomValue(curPageAtom);
  const totPages = useAtomValue(totPagesAtom);

  const toPrevPage = useSetAtom(toPrevPageAtom);
  const toNextPage = useSetAtom(toNextPageAtom);
  const toFstPage = useSetAtom(toFstPageAtom);
  const toLstPage = useSetAtom(toLstPageAtom);
  const toPage = useSetAtom(toPageAtom);

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
