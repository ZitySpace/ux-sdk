import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageCarousel from '../ImageCarousel';
import ImageList from '../ImageList';
import StoreProvider from './StoreProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/StoreProvider',
  component: StoreProvider,
} as ComponentMeta<typeof StoreProvider>;

const queryClient = new QueryClient();

const TemplateSimple: ComponentStory<typeof StoreProvider> = (args) => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider {...args}>
      <ImageCarousel />
    </StoreProvider>
  </QueryClientProvider>
);

export const SimpleStory = TemplateSimple.bind({});
SimpleStory.args = {
  filtering: { by: 'Category', value: 'shoes' },
};

const TemplateComposite: ComponentStory<typeof StoreProvider> = (args) => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider {...args}>
      <ImageCarousel />
      <ImageList />
    </StoreProvider>
  </QueryClientProvider>
);

export const CompositeStory = TemplateComposite.bind({});
CompositeStory.args = {
  filtering: { by: 'Category', value: 'pants' },
};
