import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageCarousel from './ImageCarousel';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
} as ComponentMeta<typeof ImageCarousel>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof ImageCarousel> = (args) => (
  <QueryClientProvider client={queryClient}>
    <ImageCarousel {...args} />
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {};
