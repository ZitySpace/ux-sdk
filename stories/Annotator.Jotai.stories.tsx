import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider } from '@/hooks';
import { useJotaiCarouselSetSize, useJotaiCarouselSetPage } from '@/atoms';
import { JotaiAnnotator } from '@/components';

const meta: Meta<typeof JotaiAnnotator> = {
  title: 'UX-SDK/JotaiAnnotator',
  component: JotaiAnnotator,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useJotaiCarouselSetSize();
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div style={{ height: 540 }}>
        <JotaiAnnotator />
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
