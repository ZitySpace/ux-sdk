import React from 'react';

export interface SimpleButtonProps {
  label: string;
}

const SimpleButton = (props: SimpleButtonProps) => {
  return (
    <button
      className='flex justify-center p-2 bg-indigo-600 text-gray-200 rounded-lg border-2 border-red-400'
      onClick={() => {
        alert('I am a template button :)');
      }}
    >
      {props.label}
    </button>
  );
};

export default SimpleButton;
