import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Toggle from './Toggle';
import Slider from './Slider';

const ScikitGroup = forwardRef(
  ({ children }: { children: React.ReactNode }, ref) => {
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
      <div className='flex flex-col space-y-2'>
        {React.Children.map(children, (c) => {
          const pass =
            React.isValidElement(c) && (c.type === Toggle || c.type === Slider);

          if (!pass) return c;

          const name = c.props.name;
          if (!(name in childRefs)) childRefs[name] = useRef();

          return React.cloneElement(c, { ...c.props, ref: childRefs[name] });
        })}
      </div>
    );
  }
);

export default ScikitGroup;
