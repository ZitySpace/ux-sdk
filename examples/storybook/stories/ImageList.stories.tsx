import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  useContextStore,
  usePagingStore,
  useCarouselStore,
} from '@zityspace/ux-sdk/stores';
import { useCarouselSetPage, QueryProvider } from '@zityspace/ux-sdk/hooks';
import { ImageList } from '@zityspace/ux-sdk/components';

export default {
  title: 'UX-SDK/ImageList',
  component: ImageList,
} as ComponentMeta<typeof ImageList>;

const Template: ComponentStory<any> = (args) => {
  const Story = () => {
    const contextStore = useContextStore(args.context.storeName);
    const pagingStore = usePagingStore(args.paginationBar.storeName);
    const carouselStore = useCarouselStore(args.imageCarousel.storeName);

    const setCarouselPage = useCarouselSetPage({
      contextStore,
      pagingStore,
      carouselStore,
    });

    const pageQuery = setCarouselPage();

    if (pageQuery.isLoading) return <></>;

    return <ImageList carouselStoreName={args.imageCarousel.storeName} />;
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
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
