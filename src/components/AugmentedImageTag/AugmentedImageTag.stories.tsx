import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import AugmentedImageTag from './AugmentedImageTag';

import { useCarouselStore } from '../../stores/carouselStore';

import { useAPIs } from '../../utils/apis';

import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/AugmentedImageTag',
  component: AugmentedImageTag,
} as ComponentMeta<typeof AugmentedImageTag>;

const queryClient = new QueryClient();

const Template: ComponentStory<typeof AugmentedImageTag> = (args) => {
  const carouselStore = useCarouselStore(args.carouselStoreName, {
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
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className='h-64 w-64'>
        <AugmentedImageTag {...args} />
      </div>
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
        w: Math.floor(Math.random() * 50 + 50),
        h: Math.floor(Math.random() * 50 + 50),
        category: 'augmentedBox',
      },
    ],
  };
};

export const Story = Template.bind({});
Story.args = {
  name: 'duck',
  augmenter: augmenter,
  carouselStoreName: 'AugmentedImageTag.stories.carouselStore',
};
