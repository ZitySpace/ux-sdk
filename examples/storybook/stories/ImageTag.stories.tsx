import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { useCarouselStore } from '@zityspace/ux-sdk/stores';
import { ImageTag } from '@zityspace/ux-sdk/components';
import { QueryProvider } from '@zityspace/ux-sdk/hooks';

export default {
  title: 'UX-SDK/ImageTag',
  component: ImageTag,
} as ComponentMeta<typeof ImageTag>;

const Template: ComponentStory<typeof ImageTag> = (args) => {
  const carouselStore = useCarouselStore(args.carouselStoreName!, {
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
    <QueryProvider>
      <div className='h-64 w-64'>
        <ImageTag name={args.name} carouselStoreName={args.carouselStoreName} />
      </div>
    </QueryProvider>
  );
};

export const Story = Template.bind({});
Story.args = {
  name: 'duck',
  carouselStoreName: 'ImageTage.stories.carouselStore',
};
