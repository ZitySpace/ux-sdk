import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';
import Select from './Select';
import Input from './Input';
import MultiSelect from './MultiSelect';
import { CheckCircleIcon, RefreshIcon } from '@heroicons/react/outline';

type YesCallbackProps = (params: { [key: string]: unknown }) => unknown;

type ChildRefProps = {
  getValue: Function;
  reset: Function;
  setValue: Function;
};

const ScikitGroup = forwardRef(
  (
    {
      title = 'Scikit Group',
      yesCallback = (params) => {},
      reactive = false,
      hideTitle = false,
      hideFooter = false,
      flat = false,
      scroll = true,
      children,
    }: {
      title?: string;
      yesCallback?: YesCallbackProps;
      reactive?: boolean;
      hideTitle?: boolean;
      hideFooter?: boolean;
      flat?: boolean;
      scroll?: boolean;
      children: React.ReactNode;
    },
    ref
  ) => {
    const childRefs: {
      [key: string]: React.MutableRefObject<
        ChildRefProps | undefined | { reactiveCallback: () => unknown }
      >;
    } = {};

    const getValue = () =>
      Object.entries(childRefs).reduce(
        (prev, [key, r]) => ({
          ...prev,
          [key]: (r.current as ChildRefProps).getValue(),
        }),
        {}
      );

    const getSetValue = () =>
      Object.entries(childRefs).reduce(
        (prev, [key, r]) => ({
          ...prev,
          [key]: (r.current as ChildRefProps).setValue,
        }),
        {}
      );

    const reset = () =>
      Object.values(childRefs).map((r) => (r.current as ChildRefProps).reset());

    const reactiveCallback = reactive
      ? () => yesCallback(getValue())
      : undefined;

    useImperativeHandle(ref, () => ({
      getValue: getValue,
      getSetValue: getSetValue,
    }));

    return (
      <div
        className={`us-bg-gray-100 us-h-full us-flex us-flex-col us-rounded-md ${
          flat ? '' : 'us-shadow-lg'
        }`}
      >
        {!hideTitle && (
          <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2 us-text-xs'>
            <span>{title}</span>
          </div>
        )}
        <div
          className={`us-flex us-justify-center ${
            scroll ? 'us-overflow-scroll' : ''
          }`}
        >
          <div className='us-flex-col us-space-y-2 us-pt-2 us-pb-4 us-h-full'>
            {React.Children.map(children, (c) => {
              const pass =
                React.isValidElement(c) &&
                (c.type === Toggle ||
                  c.type === Slider ||
                  c.type === Select ||
                  c.type === MultiSelect ||
                  c.type === Input);

              if (!pass) return c;

              const name = (c.props as { name: string }).name;
              if (!(name in childRefs)) childRefs[name] = useRef();

              return React.cloneElement(c, {
                ...(c.props as any),
                reactiveCallback,
                ref: childRefs[name],
              });
            })}

            {!hideFooter && (
              <div className='us-pt-3 us-flex us-space-x-2 us-justify-start us-ml-28 us-pl-3'>
                <button
                  type='button'
                  className='us-inline-flex us-items-center us-px-5 us-py-1 us-border us-border-transparent us-shadow-sm us-text-sm us-leading-4 us-font-medium us-rounded-md us-text-white  us-bg-amber-400 hover:us-bg-amber-500 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-1 focus:us-ring-amber-600'
                  onClick={reset}
                >
                  <RefreshIcon className='us-h-4 us-w-4' aria-hidden='true' />
                </button>
                <button
                  type='button'
                  className='us-inline-flex us-items-center us-px-5 us-py-1 us-border us-border-transparent us-shadow-sm us-text-sm us-leading-4 us-font-medium us-rounded-md us-text-white us-bg-teal-400 hover:us-bg-teal-500 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-1 focus:us-ring-teal-600'
                  onClick={() => yesCallback(getValue())}
                >
                  <CheckCircleIcon
                    className='us-h-5 us-w-5'
                    aria-hidden='true'
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ScikitGroup;
