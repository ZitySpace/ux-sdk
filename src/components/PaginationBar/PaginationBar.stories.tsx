import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import PaginationBar from './PaginationBar';

export default {
  title: 'UX-SDK/PaginationBar',
  component: PaginationBar,
} as ComponentMeta<typeof PaginationBar>;

const Template: ComponentStory<typeof PaginationBar> = (args) => {
  const total = args.total;
  const [pos, setPos] = useState(args.pos);
  const [step, setStep] = useState(args.step);

  return (
    <PaginationBar
      step={step}
      pos={pos}
      total={total}
      setPos={setPos}
      setStep={setStep}
    />
  );
};

export const Story = Template.bind({});
Story.args = {
  pos: 13,
  step: 10,
  total: 123,
};
