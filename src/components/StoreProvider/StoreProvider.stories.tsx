import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageCarousel from '../ImageCarousel';
import StoreProvider from './StoreProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/StoreProvider',
  component: StoreProvider,
} as ComponentMeta<typeof StoreProvider>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof StoreProvider> = (args) => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider {...args}>
      <ImageCarousel />
    </StoreProvider>
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {};
