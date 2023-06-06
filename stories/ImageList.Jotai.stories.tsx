import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { JotaiImageList } from '@/components';
import { useJotaiCarouselSetPage } from '@/atoms';
import { QueryProvider } from '@/hooks';

const meta: Meta<typeof JotaiImageList> = {
  title: 'UX-SDK/JotaiImageList',
  component: JotaiImageList,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

    if (isPageLoading) return <></>;

    return <JotaiImageList />;
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
