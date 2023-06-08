import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PaginationBar } from '@/components';
import { Provider } from 'jotai';

const meta: Meta<typeof PaginationBar> = {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
};
export default meta;

const Template = () => {
  return (
    <div className='us-bg-gray-100 us-flex-grow us-flex us-justify-center'>
      <PaginationBar />
    </div>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => (
    <Provider>
      <Template />
    </Provider>
  ),
  args: {},
};
