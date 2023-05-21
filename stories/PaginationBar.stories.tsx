import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useRef } from 'react';
import { usePagingStore } from '@/stores';
import { PaginationBar } from '@/components';

const meta: Meta<typeof PaginationBar> = {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
};
export default meta;

const Template = (args: any) => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  const pagingStore = usePagingStore(
    args.pagingStoreName,
    args.pagingStoreInit,
    args.resetOnFirstMount && !mounted.current
  );

  return (
    <div className='us-bg-gray-100 us-flex-grow us-flex us-justify-center'>
      <PaginationBar pagingStoreName={args.pagingStoreName} />
    </div>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    pagingStoreName: 'PaginationBar.stories.pagingStore',
    pagingStoreInit: { step: 20, pos: 30 },
    resetOnFirstMount: true,
  },
};
