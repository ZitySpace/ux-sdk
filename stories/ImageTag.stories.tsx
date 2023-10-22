import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageTag } from '@/components';
import { LabelType } from '@zityspace/react-annotate';
import { carouselDataAtom, apiEndpointAtom } from '@/atoms';
import { useAtom, useSetAtom, Provider } from 'jotai';

const meta: Meta<typeof ImageTag> = {
  title: 'UX-SDK/ImageTag',
  component: ImageTag,
};
export default meta;

const Template = (args: any) => {
  const [carouselData, setCarouselData] = useAtom(carouselDataAtom);

  const setApiEndpoint = useSetAtom(apiEndpointAtom);

  useEffect(() => {
    setApiEndpoint('/formula-serv/zityspace/image-carousel/default');
    setCarouselData({
      carouselData: {
        ['kol_batch1_372.jpg']: {
          name: 'kol_batch1_372.jpg',
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

      selection: { selectable: false, selected: { duck: false } },
    });
  }, []);

  if (!Object.keys(carouselData.carouselData).length) return <></>;

  return (
    <div className='us-h-64 us-w-64'>
      <ImageTag name={args.name} />
    </div>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => (
    <Provider>
      <Template {...args} />
    </Provider>
  ),
  args: {
    name: 'kol_batch1_372.jpg',
  },
};
