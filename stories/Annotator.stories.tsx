import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider } from '@/hooks';
import { useCarouselSetSize, useCarouselSetPage } from '@/atoms';
import { Annotator } from '@/components';

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
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
