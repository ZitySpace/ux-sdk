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
      <PaginationBar {...args} />
    </PagingStoreProvider>
  );
};

export const Story = Template.bind({});
Story.args = {};
