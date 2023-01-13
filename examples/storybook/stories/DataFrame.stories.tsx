import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { usePagingStore, useDataframeStore } from '@zityspace/ux-sdk/stores';
import { DataFrame, PaginationBar } from '@zityspace/ux-sdk/components';

export default {
  title: 'UX-SDK/DataFrame',
  component: DataFrame,
} as ComponentMeta<typeof DataFrame>;

const initDF = {
  header: ['colA', 'colB', 'colC'],
  data: Array.from({ length: 123 }, (_, i) => ['a-' + i, 'b-' + i, 'c-' + i]),
};

const Template: ComponentStory<typeof DataFrame> = (args) => {
  const pagingStore = usePagingStore(args.pagingStoreName!);
  const dataframeStore = useDataframeStore(args.dataframeStoreName!, initDF);

  return (
    <>
      <DataFrame {...args} />
      <PaginationBar pagingStoreName={args.pagingStoreName} />
    </>
  );
};

export const Story = Template.bind({});
Story.args = {
  title: 'DataFrame Preview',
  dataframeStoreName: 'DataFrame.stories.dataframeStore',
  pagingStoreName: 'DataFrame.stories.pagingStore',
};
