import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import PaginationBar from './PaginationBar';

export default {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = (args) => {
  return (
    <div className='bg-gray-100 flex-grow flex justify-center'>
      <PaginationBar {...args} />
    </div>
  );
};

export const Story = Template.bind({});
Story.args = {
  storeName: 'PaginationBar.stories.paingStore',
  storeInit: { step: 20, pos: 30 },
  resetOnFirstMount: false,
};
