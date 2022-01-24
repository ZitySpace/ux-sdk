import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import PaginationBar from './PaginationBar';

export default {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = (args) => {
  return <PaginationBar {...args} />;
};

export const Story = Template.bind({});
Story.args = {};
