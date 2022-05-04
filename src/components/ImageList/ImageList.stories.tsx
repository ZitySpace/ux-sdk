import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageList from './ImageList';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useContextStore } from '../../stores/contextStore';
import { usePagingStore } from '../../stores/pagingStore';
import { useCarouselStore } from '../../stores/carouselStore';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';

export default {
  title: 'UX-SDK/ImageList',
  component: ImageList,
} as ComponentMeta<typeof ImageList>;

const queryClient = new QueryClient();

const Template: ComponentStory<any> = (args) => {
  const Story = () => {
    const contextStore = useContextStore(args.context.storeName);
    const pagingStore = usePagingStore(args.paginationBar.storeName);
    const carouselStore = useCarouselStore(args.imageCarousel.storeName);

    const { useCarouselPageQuery } = useCarouselQueries({
      contextStore: contextStore,
      pagingStore: pagingStore,
      carouselStore: carouselStore,
    });

    const pageQuery = useCarouselPageQuery();
    if (pageQuery.isLoading) return <></>;

    return <ImageList carouselStoreName={args.imageCarousel.storeName} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

export const Story = Template.bind({});
Story.args = {
  imageCarousel: {
    storeName: 'ImageList.stories.carouselStore',
  },
  paginationBar: {
    storeName: 'ImageList.stories.pagingStore',
  },
  context: {
    storeName: 'ImageList.stories.contextStore',
  },
};
