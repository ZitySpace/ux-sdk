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
      setValue,
    }));

    return (
      <div className='us-flex us-items-center us-justify-start'>
        <div className='us-w-28 us-mr-3 us-relative h-7'>
          <label
            htmlFor={name}
            className='us-block us-absolute us-right-0 us-text-right us-text-sm us-font-medium us-text-gray-700'
          >
            {name}
          </label>
        </div>
        <div className='us-mt-1 us-flex us-items-center'>
          <input
            type={type}
            name={name}
            className={`us-bg-white us-relative us-w-full us-border ${
              required && value === ''
                ? 'us-outline-none us-ring-1 us-ring-red-500 us-border-red-500'
                : 'us-border-gray-100 focus:us-outline-none focus:us-ring-1 focus:us-ring-indigo-500 focus:us-border-indigo-500 '
            } us-rounded-md us-shadow-sm us-pl-3 us-pr-10 us-py-1 us-text-left us-cursor-default us-text-sm`}
            value={value}
            onChange={(evt) => setValue(evt.target.value)}
          />
        </div>
      </div>
    );
  }
);

export default Input;
