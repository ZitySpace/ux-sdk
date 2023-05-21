import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { usePagingStore, useDataframeStore } from '@/stores';
import { DataFrame, PaginationBar } from '@/components';

const meta: Meta<typeof DataFrame> = {
  title: 'UX-SDK/DataFrame',
  component: DataFrame,
};
export default meta;

const initDF = {
  header: ['colA', 'colB', 'colC'],
  data: Array.from({ length: 123 }, (_, i) => ['a-' + i, 'b-' + i, 'c-' + i]),
};

const Template = (args: any) => {
  const pagingStore = usePagingStore(args.pagingStoreName!);
  const dataframeStore = useDataframeStore(args.dataframeStoreName!, initDF);

  return (
    <>
      <DataFrame {...args} />
      <PaginationBar pagingStoreName={args.pagingStoreName} />
    </>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    title: 'DataFrame Preview',
    dataframeStoreName: 'DataFrame.stories.dataframeStore',
    pagingStoreName: 'DataFrame.stories.pagingStore',
  },
};
