import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageCarousel from './ImageCarousel';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CarouselStoreProvider,
  createCarouselStore,
} from '../../stores/carouselStore';

import {
  PagingStoreProvider,
  createPagingStore,
} from '../../stores/pagingStore';

export default {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
} as ComponentMeta<typeof ImageCarousel>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof ImageCarousel> = (args) => (
  <QueryClientProvider client={queryClient}>
    <PagingStoreProvider createStore={createPagingStore}>
      <CarouselStoreProvider createStore={createCarouselStore}>
        <ImageCarousel {...args} />
      </CarouselStoreProvider>
    </PagingStoreProvider>
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {};
