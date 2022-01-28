import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageTag from './ImageTag';

import {
  CarouselStoreProvider,
  createCarouselStore,
} from '../../stores/carouselStore';

export default {
  title: 'UX-SDK/ImageTag',
  component: ImageTag,
} as ComponentMeta<typeof ImageTag>;

const Template: ComponentStory<typeof ImageTag> = (args) => {
  return (
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
        <ImageTag {...args} />
      </div>
    </CarouselStoreProvider>
  );
};

export const Story = Template.bind({});
Story.args = { name: 'duck' };
