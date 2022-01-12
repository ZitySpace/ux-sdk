import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import ImageCarousel from './ImageCarousel';

export default {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
} as ComponentMeta<typeof ImageCarousel>;

const Template: ComponentStory<typeof ImageCarousel> = (args) => (
  <ImageCarousel {...args} />
);

export const Story = Template.bind({});
Story.args = {};
