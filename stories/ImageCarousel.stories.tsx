import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageCarousel, PaginationBar } from '@/components';
import { QueryProvider, useCarouselSetSize, useCarouselSetPage } from '@/hooks';
import { apiEndpointAtom } from '@/atoms';
import { Provider, useSetAtom } from 'jotai';

const meta: Meta<typeof ImageCarousel> = {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    const setApiEndpoint = useSetAtom(apiEndpointAtom);

    useEffect(() => {
      setApiEndpoint(`/formula-serv/zityspace/image-carousel/default`);
    }, []);

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div className='flex flex-col space-y-4'>
        <div className='shadow-lg'>
          <ImageCarousel />
          <PaginationBar />
        </div>
      </div>
    );
  };
  return (
    <Provider>
      <QueryProvider>
        <Story />
      </QueryProvider>
    </Provider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
