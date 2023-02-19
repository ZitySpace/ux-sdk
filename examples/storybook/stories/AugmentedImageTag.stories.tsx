import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { useCarouselStore, useAPIStore } from '@zityspace/ux-sdk/stores';
import { QueryProvider } from '@zityspace/ux-sdk/hooks';
import { AugmentedImageTag } from '@zityspace/ux-sdk/components';
import { LabelType } from '@zityspace/react-annotate';
import { useStore } from 'zustand';

export default {
  title: 'UX-SDK/AugmentedImageTag',
  component: AugmentedImageTag,
} as ComponentMeta<typeof AugmentedImageTag>;

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category?: string;
}

const Template: ComponentStory<any> = (args) => {
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
            type: LabelType.Box,
          },
          {
            x: 200,
            y: 300,
            w: 100,
            h: 50,
            category: 'cateB',
            type: LabelType.Box,
          },
        ],
      },
    },

    selection: { selectable: true, selected: { duck: false } },
  });

  const apiStore = useAPIStore();

  const getImage = useStore(apiStore, (s) => s.apis.getImage);

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

  return (
    <QueryProvider>
      <div className='h-64 w-64'>
        <AugmentedImageTag
          name={args.name}
          augmenter={augmenter}
          carouselStoreName={args.carouselStoreName}
        />
      </div>
    </QueryProvider>
  );
};

export const Story = Template.bind({});
Story.args = {
  name: 'duck',
  carouselStoreName: 'AugmentedImageTag.stories.carouselStore',
};
