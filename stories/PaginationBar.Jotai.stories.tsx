import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { JotaiPaginationBar } from '@/components';

const meta: Meta<typeof JotaiPaginationBar> = {
  title: 'UX-SDK/JotaiPaginationBar',
  component: JotaiPaginationBar,
};
export default meta;

const Template = () => {
  return (
    <div className='us-bg-gray-100 us-flex-grow us-flex us-justify-center'>
      <JotaiPaginationBar />
    </div>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
