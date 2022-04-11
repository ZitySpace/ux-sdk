import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import AugmentedImageTag from './AugmentedImageTag';

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

import { useAPIs } from '../../utils/apis';

import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/AugmentedImageTag',
  component: AugmentedImageTag,
} as ComponentMeta<typeof AugmentedImageTag>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof AugmentedImageTag> = (args) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextStoreProvider createStore={createContextStore}>
        <PagingStoreProvider createStore={createPagingStore}>
          <CarouselStoreProvider
            createStore={() =>
              createCarouselStore({
                carouselData: {
                  duck: {
                    name: 'duck',
                    annotations: [
                      {
                        x: 100,
                        y: 200,
                        w: 50,
                        h: 80,
                        category: 'cateA',
                      },
                      {
                        x: 200,
                        y: 300,
                        w: 100,
                        h: 50,
                        category: 'cateB',
                      },
                    ],
                  },
                },

                selection: { selectable: true, selected: { duck: false } },
              })
            }
          >
            <div className='h-64 w-64'>
              <AugmentedImageTag {...args} />
            </div>
          </CarouselStoreProvider>
        </PagingStoreProvider>
      </ContextStoreProvider>
    </QueryClientProvider>
  );
};

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category?: string;
}
const { getImage } = useAPIs();

const augmenter = async (name: string, bboxes: BoxProps[] = []) => {
  return {
    imageSrc: await getImage(name),
    augBoxes: [
      ...bboxes,
      {
        x: 300,
        y: 400,
        w: Math.floor(Math.random() * 100 + 100),
        h: Math.floor(Math.random() * 100 + 100),
        category: 'augmentedBox',
      },
    ],
  };
};

export const Story = Template.bind({});
Story.args = { name: 'duck', augmenter: augmenter };
