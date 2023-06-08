import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { JotaiImageTag } from '@/components';
import { QueryProvider } from '@/hooks';
import { LabelType } from '@zityspace/react-annotate';
import { carouselDataAtom } from '@/atoms';
import { useSetAtom } from 'jotai';

const meta: Meta<typeof JotaiImageTag> = {
  title: 'UX-SDK/JotaiImageTag',
  component: JotaiImageTag,
};
export default meta;

const Template = (args: any) => {
  const setCarouselData = useSetAtom(carouselDataAtom);
  setCarouselData({
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
        <JotaiImageTag name={args.name} />
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
