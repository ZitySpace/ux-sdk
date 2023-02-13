import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { Switch } from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Toggle = forwardRef(
  (
    {
      name,
      defaultValue = false,
      reactiveCallback = undefined,
    }: {
      name: string;
      defaultValue?: boolean;
      reactiveCallback?: () => unknown;
    },
    ref
  ) => {
    const [enabled, setEnabled] = useState<boolean>(defaultValue);

    useEffect(() => {
      reactiveCallback && reactiveCallback();
    }, [enabled]);

    useImperativeHandle(ref, () => ({
      getValue: () => enabled,
      reset: () => setEnabled(defaultValue),
    }));

    return (
      <Switch.Group
        as='div'
        className='us-flex us-items-center us-justify-start'
      >
        <div className='us-w-28 us-mr-3 us-relative us-h-7'>
          <Switch.Label
            as='span'
            className='us-text-right us-absolute us-right-0'
          >
            <span className='us-text-sm us-font-medium us-text-gray-700'>
              {name}
            </span>
          </Switch.Label>
        </div>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={classNames(
            enabled ? 'us-bg-indigo-600' : 'us-bg-gray-200',
            'us-relative us-inline-flex us-flex-shrink-0 us-h-6 us-w-11 us-border-2 us-border-transparent us-rounded-full us-cursor-pointer us-transition-colors us-ease-in-out us-duration-200 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-2 focus:us-ring-indigo-500'
          )}
        >
          <span className='us-sr-only'>{name}</span>
          <span
            className={classNames(
              enabled ? 'us-translate-x-5' : 'us-translate-x-0',
              'us-pointer-events-none us-relative us-inline-block us-h-5 us-w-5 us-rounded-full us-bg-white us-shadow us-transform us-ring-0 us-transition us-ease-in-out us-duration-200'
            )}
          >
            <span
              className={classNames(
                enabled
                  ? 'us-opacity-0 us-ease-out us-duration-100'
                  : 'us-opacity-100 us-ease-in us-duration-200',
                'us-absolute us-inset-0 us-h-full us-w-full us-flex us-items-center us-justify-center us-transition-opacity'
              )}
              aria-hidden='true'
            >
              <svg
                className='us-h-3 us-w-3 us-text-gray-400'
                fill='none'
                viewBox='0 0 12 12'
              >
                <path
                  d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
            <span
              className={classNames(
                enabled
                  ? 'us-opacity-100 us-ease-in us-duration-200'
                  : 'us-opacity-0 us-ease-out us-duration-100',
                'us-absolute us-inset-0 us-h-full us-w-full us-flex us-items-center us-justify-center us-transition-opacity'
              )}
              aria-hidden='true'
            >
              <svg
                className='us-h-3 us-w-3 us-text-indigo-600'
                fill='currentColor'
                viewBox='0 0 12 12'
              >
                <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
              </svg>
            </span>
          </span>
        </Switch>
      </Switch.Group>
    );
  }
);

export default Toggle;
