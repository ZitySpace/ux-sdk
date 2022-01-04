import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import SimpleButton from './SimpleButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/SimpleButton',
  component: SimpleButton,
} as ComponentMeta<typeof SimpleButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SimpleButton> = (args) => (
  <SimpleButton {...args} />
);

export const HelloWorld = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  label: 'Hello world!',
};

export const ClickMe = Template.bind({});
ClickMe.args = {
  label: 'Click me!',
};
