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
    <div className='us-bg-red-400 us-p-3'>
      <JotaiPaginationBar />
    </div>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
