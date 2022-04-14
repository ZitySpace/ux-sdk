import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Input = forwardRef(
  (
    {
      name,
      defaultValue = '',
      type = 'text',
      required = true,
    }: {
      name: string;
      defaultValue?: string;
      type?: string;
      required?: boolean;
    },
    ref
  ) => {
    const [value, setValue] = useState(defaultValue);
    const [valid, setValid] = useState(true);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      reset: () => setValue(defaultValue),
    }));

    return (
      <div className='flex items-center justify-start'>
        <label
          htmlFor={name}
          className='block mr-3 w-24 text-right text-sm font-medium text-gray-700'
        >
          {name}
        </label>
        <div className='mt-1 flex items-center'>
          <input
            type={type}
            name={name}
            className={`bg-white relative w-full border ${
              valid
                ? 'border-gray-100'
                : 'outline-none ring-1 ring-red-500 border-red-500'
            } rounded-md shadow-sm pl-3 pr-10 py-1 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
            value={value}
            onChange={(evt) => setValue(evt.target.value)}
            onBlur={() => setValid(!(required && value === ''))}
          />
        </div>
      </div>
    );
  }
);

export default Input;
