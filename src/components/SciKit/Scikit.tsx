import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';
import Select from './Select';
import Input from './Input';
import MultiSelect from './MultiSelect';
import { CheckCircleIcon, RefreshIcon } from '@heroicons/react/outline';

type YesCallbackProps = (params: { [key: string]: unknown }) => unknown;

type ChildRefProps = { getValue: Function; reset: Function };

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

    const reset = () =>
      Object.values(childRefs).map((r) => (r.current as ChildRefProps).reset());

    useImperativeHandle(ref, () => ({ getValue: getValue }));

    return (
      <div
        className={`bg-gray-100 h-full flex flex-col rounded-md ${
          flat ? '' : 'shadow-lg'
        }`}
      >
        {!hideTitle && (
          <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
            <span>{title}</span>
          </div>
        )}
        <div
          className={`flex justify-center ${scroll ? 'overflow-scroll' : ''}`}
        >
          <div className='flex-col space-y-2 pt-2 pb-4 h-full'>
            {React.Children.map(children, (c) => {
              const pass =
                React.isValidElement(c) &&
                (c.type === Toggle ||
                  c.type === Slider ||
                  c.type === Select ||
                  c.type === MultiSelect ||
                  c.type === Input);

              if (!pass) return c;

              const name = c.props.name;
              if (!(name in childRefs))
                childRefs[name] = useRef(
                  reactive
                    ? { reactiveCallback: () => yesCallback(getValue()) }
                    : undefined
                );

              return React.cloneElement(c, {
                ...c.props,
                ref: childRefs[name],
              });
            })}

            {!hideFooter && (
              <div className='pt-3 flex space-x-2 justify-start ml-28 pl-3'>
                <button
                  type='button'
                  className='inline-flex items-center px-5 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white  bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-amber-600'
                  onClick={reset}
                >
                  <RefreshIcon className='h-4 w-4' aria-hidden='true' />
                </button>
                <button
                  type='button'
                  className='inline-flex items-center px-5 py-1 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-600'
                  onClick={() => yesCallback(getValue())}
                >
                  <CheckCircleIcon className='h-5 w-5' aria-hidden='true' />
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
