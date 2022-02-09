import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageList from './ImageList';
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
  title: 'UX-SDK/ImageList',
  component: ImageList,
} as ComponentMeta<typeof ImageList>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof ImageList> = (args) => (
  <QueryClientProvider client={queryClient}>
    <ContextStoreProvider createStore={createContextStore}>
      <PagingStoreProvider createStore={createPagingStore}>
        <CarouselStoreProvider createStore={createCarouselStore}>
          <ImageList {...args} />
        </CarouselStoreProvider>
      </PagingStoreProvider>
    </ContextStoreProvider>
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {};
