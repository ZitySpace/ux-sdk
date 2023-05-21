import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useCarouselStore } from '@/stores';
import { ImageTag } from '@/components';
import { QueryProvider } from '@/hooks';
import { LabelType } from '@zityspace/react-annotate';

const meta: Meta<typeof ImageTag> = {
  title: 'UX-SDK/ImageTag',
  component: ImageTag,
};
export default meta;

const Template = (args: any) => {
  const carouselStore = useCarouselStore(args.carouselStoreName!, {
    carouselData: {
      duck: {
        name: 'duck',
        annotations: [
          {
            type: LabelType.Box,
            x: 100,
            y: 200,
            w: 50,
            h: 80,
            category: 'cateA',
          },
          {
            type: LabelType.Box,
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
    <QueryProvider>
      <div className='us-h-64 us-w-64'>
        <ImageTag name={args.name} carouselStoreName={args.carouselStoreName} />
      </div>
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    name: 'duck',
    carouselStoreName: 'ImageTage.stories.carouselStore',
  },
};
