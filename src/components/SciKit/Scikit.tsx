import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';
import Select from './Select';

const ScikitGroup = forwardRef(
  (
    {
      title = 'Scikit Group',
      children,
    }: { title?: string; children: React.ReactNode },
    ref
  ) => {
    const childRefs: {
      [key: string]: React.MutableRefObject<{ getValue: Function } | undefined>;
    } = {};

    const getValue = () =>
      Object.entries(childRefs).reduce(
        (prev, [key, r]) => ({ ...prev, [key]: r.current!.getValue() }),
        {}
      );

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
                (c.type === Toggle || c.type === Slider || c.type === Select);

              if (!pass) return c;

              const name = c.props.name;
              if (!(name in childRefs)) childRefs[name] = useRef();

              return React.cloneElement(c, {
                ...c.props,
                ref: childRefs[name],
              });
            })}
          </div>
        </div>
      </div>
    );
  }
);

export default ScikitGroup;
