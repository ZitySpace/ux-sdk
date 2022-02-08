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

import {
  ContextStoreProvider,
  createContextStore,
} from '../../stores/contextStore';

export default {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
} as ComponentMeta<typeof ImageCarousel>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof ImageCarousel> = (args) => (
  <QueryClientProvider client={queryClient}>
    <ContextStoreProvider createStore={createContextStore}>
      <PagingStoreProvider createStore={createPagingStore}>
        <CarouselStoreProvider createStore={createCarouselStore}>
          <ImageCarousel {...args} />
        </CarouselStoreProvider>
      </PagingStoreProvider>
    </ContextStoreProvider>
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {};
