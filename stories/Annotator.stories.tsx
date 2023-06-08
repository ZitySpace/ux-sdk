import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider, useCarouselSetSize, useCarouselSetPage } from '@/hooks';
import { Annotator } from '@/components';
import { Provider } from 'jotai';

const meta: Meta<typeof Annotator> = {
  title: 'UX-SDK/Annotator',
  component: Annotator,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div style={{ height: 540 }}>
        <Annotator />
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
