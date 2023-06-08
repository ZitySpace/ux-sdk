import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageList } from '@/components';
import { QueryProvider, useCarouselSetPage } from '@/hooks';
import { Provider } from 'jotai';

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
