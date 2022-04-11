import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Comparer from './Comparer';
import ImageTag from '../ImageTag';
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
  title: 'UX-SDK/Comparer',
  component: Comparer,
} as ComponentMeta<typeof Comparer>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof Comparer> = (args) => (
  <QueryClientProvider client={queryClient}>
    <ContextStoreProvider createStore={createContextStore}>
      <PagingStoreProvider createStore={createPagingStore}>
        <CarouselStoreProvider createStore={createCarouselStore}>
          <Comparer {...args} />
        </CarouselStoreProvider>
      </PagingStoreProvider>
    </ContextStoreProvider>
  </QueryClientProvider>
);

export const Story = Template.bind({});
Story.args = {
  Components: [ImageTag, ImageTag],
};
