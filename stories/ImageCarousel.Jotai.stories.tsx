import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { JotaiImageCarousel, JotaiPaginationBar } from '@/components';
import { useJotaiCarouselSetSize, useJotaiCarouselSetPage } from '@/atoms';
import { QueryProvider } from '@/hooks';

const meta: Meta<typeof JotaiImageCarousel> = {
  title: 'UX-SDK/JotaiImageCarousel',
  component: JotaiImageCarousel,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useJotaiCarouselSetSize();
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div className='flex flex-col space-y-4'>
        <div className='shadow-lg'>
          <JotaiImageCarousel />
          <JotaiPaginationBar />
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
