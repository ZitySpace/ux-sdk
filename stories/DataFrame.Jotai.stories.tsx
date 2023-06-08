import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { JotaiDataFrame, JotaiPaginationBar } from '@/components';
import { dataframeAtom } from '@/atoms';
import { useSetAtom } from 'jotai';

const meta: Meta<typeof JotaiDataFrame> = {
  title: 'UX-SDK/JotaiDataFrame',
  component: JotaiDataFrame,
};
export default meta;

const initDF = {
  header: ['colA', 'colB', 'colC'],
  data: Array.from({ length: 123 }, (_, i) => ['a-' + i, 'b-' + i, 'c-' + i]),
};

const Template = (args: any) => {
  const setDataframe = useSetAtom(dataframeAtom);
  setDataframe({
    ...initDF,
    selected: Array(initDF.data.length).fill(false),
  });

  return (
    <>
      <JotaiDataFrame {...args} />
      <JotaiPaginationBar />
    </>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    title: 'DataFrame Preview',
  },
};
