import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageCarousel, PaginationBar } from '@/components';
import { useCarouselSetSize, useCarouselSetPage } from '@/atoms';
import { QueryProvider } from '@/hooks';

const meta: Meta<typeof ImageCarousel> = {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

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
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
