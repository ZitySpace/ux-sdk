import React, {
  Fragment,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const MultiSelect = forwardRef(
  (
    {
      name,
      options = [],
      defaultValue = [],
    }: {
      name: string;
      options?: string[];
      defaultValue?: string[];
    },
    ref
  ) => {
    // optionList has to be either a ref or a global object to prevent regenerate Options during rerender
    // otherwise selected in {selected, active} will always be false
    const optionList = useRef(options.map((o, idx) => ({ id: idx, value: o })));

    const initValue = optionList.current.filter((o) =>
      defaultValue?.includes(o.value)
    );

    const [selected, setSelected] = useState(initValue);

    useImperativeHandle(ref, () => ({
      getValue: () => selected.map((s) => s.value),
      reset: () => setSelected(initValue),
    }));

    return (
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className='flex items-center justify-start'>
            <div className='w-28 mr-3 relative h-7'>
              <Listbox.Label className='absolute right-0 text-right'>
                <span className='text-sm font-medium text-gray-700'>
                  {name}
                </span>
              </Listbox.Label>
            </div>
            <div className='relative w-64'>
              <span className='inline-block w-full rounded-md shadow-sm'>
                <Listbox.Button className='bg-white relative w-full border border-gray-100 rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm'>
                  <span className='flex flex-wrap gap-2'>
                    {selected.length === 0 ? (
                      <span className='p-0.5 text-gray-200'>Empty</span>
                    ) : (
                      selected.map((opt) => (
                        <span
                          key={opt.id}
                          className='flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5'
                        >
                          <span>{opt.value}</span>
                          <svg
                            className='h-4 w-4 cursor-pointer'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setSelected((existing) =>
                                existing.filter((p) => p !== opt)
                              );
                            }}
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </span>
                      ))
                    )}
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                    <SelectorIcon
                      className='h-5 w-5 text-gray-400'
                      aria-hidden='true'
                    />
                  </span>
                </Listbox.Button>
              </span>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none '>
                  {optionList.current.map((opt) => (
                    <Listbox.Option
                      key={opt.id}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-700',
                          'cursor-default select-none relative py-1 pl-8 pr-4'
                        )
                      }
                      value={opt}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {opt.value}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                              )}
                            >
                              <CheckIcon
                                className='h-5 w-5'
                                aria-hidden='true'
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </div>
        )}
      </Listbox>
    );
  }
);

export default MultiSelect;
