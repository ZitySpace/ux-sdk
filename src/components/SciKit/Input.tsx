import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';

const Input = forwardRef(
  (
    {
      name,
      defaultValue = '',
      type = 'text',
      required = true,
      reactiveCallback = undefined,
    }: {
      name: string;
      defaultValue?: string;
      type?: string;
      required?: boolean;
      reactiveCallback?: () => unknown;
    },
    ref
  ) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      reactiveCallback && reactiveCallback();
    }, [value]);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      reset: () => setValue(defaultValue),
    }));

    return (
      <div className='flex items-center justify-start'>
        <div className='w-28 mr-3 relative h-7'>
          <label
            htmlFor={name}
            className='block absolute right-0 text-right text-sm font-medium text-gray-700'
          >
            {name}
          </label>
        </div>
        <div className='mt-1 flex items-center'>
          <input
            type={type}
            name={name}
            className={`bg-white relative w-full border ${
              required && value === ''
                ? 'outline-none ring-1 ring-red-500 border-red-500'
                : 'border-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 '
            } rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default text-sm`}
            value={value}
            onChange={(evt) => setValue(evt.target.value)}
          />
        </div>
      </div>
    );
  }
);

export default Input;
