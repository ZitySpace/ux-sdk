import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Select = forwardRef(
  (
    {
      name,
      options = [],
      defaultValue = null,
      reactiveCallback = undefined,
    }: {
      name: string;
      options?: string[];
      defaultValue?: string | null;
      reactiveCallback?: () => unknown;
    },
    ref
  ) => {
    // optionList has to be either a ref or a global object to prevent regenerate Options during rerender
    // otherwise selected in {selected, active} will always be false
    const optionList = useRef(options.map((o, idx) => ({ id: idx, value: o })));

    const initValue =
      optionList.current.filter((o) => o.value === defaultValue)[0] ||
      optionList.current[0];

    const [selected, setSelected] = useState(initValue);

    useEffect(() => {
      reactiveCallback && reactiveCallback();
    }, [selected]);

    useImperativeHandle(ref, () => ({
      getValue: () => selected.value,
      reset: () => setSelected(initValue),
      setValue: (v: string) =>
        setSelected(
          optionList.current.filter((o) => o.value === v)[0] || selected
        ),
    }));

    return (
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className='us-flex us-items-center us-justify-start'>
            <div className='us-w-28 us-mr-3 us-relative us-h-7'>
              <Listbox.Label className='us-absolute us-right-0 us-text-right'>
                <span className='us-text-sm us-font-medium us-text-gray-700'>
                  {name}
                </span>
              </Listbox.Label>
            </div>
            <div className='us-relative us-w-36'>
              <Listbox.Button className='us-bg-white us-relative us-w-full us-border us-border-gray-100 us-rounded-md us-shadow-sm us-pl-3 us-pr-10 us-py-1 us-text-left us-cursor-default focus:us-outline-none focus:us-ring-1 focus:us-ring-indigo-500 focus:us-border-indigo-500 us-text-sm'>
                <span className='us-block us-truncate'>
                  {selected ? selected.value : 'UNDEFINED'}
                </span>
                <span className='us-absolute us-inset-y-0 us-right-0 us-flex us-items-center us-pr-2 us-pointer-events-none'>
                  <SelectorIcon
                    className='us-h-5 us-w-5 us-text-gray-400'
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='us-absolute us-z-10 us-mt-1 us-w-full us-bg-white us-shadow-lg us-max-h-60 us-rounded-md us-py-1 us-text-sm us-ring-1 us-ring-black us-ring-opacity-5 us-overflow-auto focus:us-outline-none '>
                  {optionList.current.map((opt) => (
                    <Listbox.Option
                      key={opt.id}
                      className={({ active }) =>
                        classNames(
                          active
                            ? 'us-text-white us-bg-indigo-600'
                            : 'us-text-gray-700',
                          'us-cursor-default us-select-none us-relative us-py-1 us-pl-8 us-pr-4'
                        )
                      }
                      value={opt}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'us-font-semibold' : 'us-font-normal',
                              'us-block us-truncate'
                            )}
                          >
                            {opt.value}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'us-text-white' : 'us-text-indigo-600',
                                'us-absolute us-inset-y-0 us-left-0 us-flex us-items-center us-pl-1.5'
                              )}
                            >
                              <CheckIcon
                                className='us-h-5 us-w-5'
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

export default Select;
