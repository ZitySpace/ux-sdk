import { ComponentMeta, ComponentStory } from '@storybook/react';
import Toggle from './Toggle';
import Select from './Select';
import Slider from './Slider';
import ScikitGroup from './Scikit';
import React, { useRef, useState, useEffect } from 'react';

export default {
  title: 'UX-SDK/SciKit',
  component: ScikitGroup,
} as ComponentMeta<typeof ScikitGroup>;

const Template: ComponentStory<typeof ScikitGroup> = (args) => {
  const sgRef = useRef<{ getValue: Function }>();
  const [value, setValue] = useState<any | null>(null);

  useEffect(() => {
    setValue(sgRef.current.getValue());
  }, []);

  return (
    <div className='flex flex-col space-y-4'>
      <ScikitGroup ref={sgRef}>
        <Toggle name='do_Blur' defaultValue={false} />
        <Toggle name='do_Blackout' defaultValue={false} />
        <Select
          name='dataset'
          options={['ImageNet', 'CoCo', 'CUB1000', 'Some Long Option']}
        />
        <Slider
          name='jiggle_x_max'
          defaultValue={0.5}
          breakpoints={[0.1, 0.3, 0.5, 0.7, 0.9]}
          discrete={true}
        />
        <Slider
          name='jiggle_x'
          defaultValue={[-0.5, 1]}
          range={[-1, 1]}
          asRange={true}
        />
      </ScikitGroup>

      <div className='flex items-center space-x-6'>
        <button
          onClick={() => setValue(sgRef.current.getValue())}
          className='bg-indigo-400 rounded-md p-2'
        >
          Read Value
        </button>
        <span className='bg-gray-200 p-3 rounded-md text-xs'>
          {JSON.stringify(value)}
        </span>
      </div>
    </div>
  );
};

export const Story = Template.bind({});
