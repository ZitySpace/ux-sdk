import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageList } from '@/components';
import { useCarouselSetPage } from '@/atoms';
import { QueryProvider } from '@/hooks';

const meta: Meta<typeof ImageList> = {
  title: 'UX-SDK/ImageList',
  component: ImageList,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isPageLoading) return <></>;

    return <ImageList />;
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
