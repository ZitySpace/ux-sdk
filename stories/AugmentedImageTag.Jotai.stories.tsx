import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useCarouselStore, useAPIStore } from '@/stores';
import { QueryProvider } from '@/hooks';
import { JotaiAugmentedImageTag } from '@/components';
import { LabelType } from '@zityspace/react-annotate';
import { carouselDataAtom, getImageAtom } from '@/atoms';
import { useAtomValue, useSetAtom } from 'jotai';

const meta: Meta<typeof JotaiAugmentedImageTag> = {
  title: 'UX-SDK/JotaiAugmentedImageTag',
  component: JotaiAugmentedImageTag,
};
export default meta;

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category?: string;
}

const Template = (args: any) => {
  const setCarouselData = useSetAtom(carouselDataAtom);
  setCarouselData({
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

  const getImage = useAtomValue(getImageAtom);

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
      <div className='us-h-64 us-w-64'>
        <JotaiAugmentedImageTag name={args.name} augmenter={augmenter} />
      </div>
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    name: 'duck',
  },
};
