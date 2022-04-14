import { ComponentMeta, ComponentStory } from '@storybook/react';
import Toggle from './Toggle';
import Select from './Select';
import MultiSelect from './MultiSelect';
import Slider from './Slider';
import Input from './Input';
import ScikitGroup from './Scikit';
import React, { useRef, useState, useEffect } from 'react';

export default {
  title: 'UX-SDK/SciKit',
  component: ScikitGroup,
} as ComponentMeta<typeof ScikitGroup>;

const Template: ComponentStory<typeof ScikitGroup> = (args) => {
  const sgRef = useRef<{ getValue: Function; reset: Function }>();
  const [value, setValue] = useState<any | null>(null);

  useEffect(() => {
    setValue(sgRef.current.getValue());
  }, []);

  return (
    <div className='flex flex-col space-y-4'>
      <ScikitGroup ref={sgRef}>
        <Toggle name='do_Blur_Blur_Blur_Blur' defaultValue={false} />
        <Toggle name='do_Blackout' defaultValue={false} />
        <Select
          name='dataset_dataset_dataset_datset'
          defaultValue='CoCo'
          options={['ImageNet', 'CoCo', 'CUB1000', 'Some Long Option']}
        />
        <MultiSelect
          name='dataset_multi_multi_multi'
          defaultValue={['CoCo']}
          options={['ImageNet', 'CoCo', 'CUB1000', 'Some Long Option']}
        />

        <Slider name='do_AffineOrPerspectiveTransform' defaultValue={0.5} />
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
        <Slider name='do_ColorQuantizationOrGray' defaultValue={0.5} />
        <Input
          name='image_image_image_image'
          defaultValue='kol_batch1_118.jpg'
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

const TemplateTight: ComponentStory<typeof ScikitGroup> = (args) => (
  <ScikitGroup>
    <Toggle name='ignore_imgaug' />
    <Toggle name='ignore_boxaug' />
    <Slider name='do_AffineOrPerspectiveTransform' defaultValue={0.5} />
    <Slider name='do_Blur' defaultValue={0.5} />
    <Slider name='do_Blackout' defaultValue={0.5} />
    <Slider name='do_Contrast' defaultValue={0.5} />
    <Slider name='do_ColorQuantizationOrGray' defaultValue={0.5} />
    <Slider name='do_RandomText' defaultValue={0.5} />
    <Slider name='do_FlipLR' defaultValue={0.5} />
    <Slider
      name='box_jiggle_x'
      defaultValue={[-0.05, 0.1]}
      range={[-0.2, 0.2]}
      asRange={true}
    />
    <Slider
      name='box_jiggle_y'
      defaultValue={[-0.05, 0.1]}
      range={[-0.2, 0.2]}
      asRange={true}
    />
  </ScikitGroup>
);

export const StoryTight = TemplateTight.bind({});
