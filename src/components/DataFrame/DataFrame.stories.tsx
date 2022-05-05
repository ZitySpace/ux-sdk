import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import DataFrame from './DataFrame';
import PaginationBar from '../PaginationBar';
import { usePagingStore } from '../../stores/pagingStore';
import { useDataframeStore } from '../../stores/dataframeStore';

export default {
  title: 'UX-SDK/DataFrame',
  component: DataFrame,
} as ComponentMeta<typeof DataFrame>;

const initDF = {
  header: ['colA', 'colB', 'colC'],
  data: Array.from({ length: 123 }, (_, i) => ['a-' + i, 'b-' + i, 'c-' + i]),
};

const Template: ComponentStory<typeof DataFrame> = (args) => {
  const pagingStore = usePagingStore(args.pagingStoreName);
  const carouselStore = useDataframeStore(args.dataframeStoreName, initDF);

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
