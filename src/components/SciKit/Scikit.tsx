import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';
import Select from './Select';
import Input from './Input';
import MultiSelect from './MultiSelect';
import { CheckCircleIcon, RefreshIcon } from '@heroicons/react/outline';

type YesCallbackType = (params: { [key: string]: unknown }) => unknown;

const ScikitGroup = forwardRef(
  (
    {
      title = 'Scikit Group',
      yesCallback = (params) => {},
      children,
    }: {
      title?: string;
      yesCallback?: YesCallbackType;
      children: React.ReactNode;
    },
    ref
  ) => {
    const childRefs: {
      [key: string]: React.MutableRefObject<
        { getValue: Function; reset: Function } | undefined
      >;
    } = {};

    const getValue = () =>
      Object.entries(childRefs).reduce(
        (prev, [key, r]) => ({ ...prev, [key]: r.current!.getValue() }),
        {}
      );

    const reset = () => Object.values(childRefs).map((r) => r.current!.reset());

    useImperativeHandle(ref, () => ({ getValue: getValue }));

    return (
      <div className='bg-gray-100 h-full flex flex-col rounded-md shadow-lg'>
        <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
          <span>{title}</span>
        </div>
        <div className='flex justify-center'>
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
              if (!(name in childRefs)) childRefs[name] = useRef();

              return React.cloneElement(c, {
                ...c.props,
                ref: childRefs[name],
              });
            })}

            <div className='pt-3 flex space-x-2 justify-start ml-24 pl-3'>
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
          </div>
        </div>
      </div>
    );
  }
);

export default ScikitGroup;
