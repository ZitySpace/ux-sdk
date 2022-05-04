import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useEffect, useRef } from 'react';
import PaginationBar from './PaginationBar';
import { usePagingStore } from '../../stores/pagingStore';

export default {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<any> = (args) => {
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
    <div className='bg-gray-100 flex-grow flex justify-center'>
      <PaginationBar pagingStoreName={args.pagingStoreName} />
    </div>
  );
};

export const Story = Template.bind({});
Story.args = {
  pagingStoreName: 'PaginationBar.stories.pagingStore',
  pagingStoreInit: { step: 20, pos: 30 },
  resetOnFirstMount: true,
};
