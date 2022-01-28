import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import PaginationBar from './PaginationBar';

import {
  PagingStoreProvider,
  createPagingStore,
} from '../../stores/pagingStore';

export default {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = (args) => {
  return (
    <PagingStoreProvider createStore={createPagingStore}>
      <div className='bg-gray-100 flex-grow flex justify-center'>
        <PaginationBar {...args} />
      </div>
    </PagingStoreProvider>
  );
};

export const Story = Template.bind({});
Story.args = {};
