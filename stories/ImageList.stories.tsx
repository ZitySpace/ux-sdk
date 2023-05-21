import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useContextStore, usePagingStore, useCarouselStore } from '@/stores';
import { useCarouselSetPage, QueryProvider } from '@/hooks';
import { ImageList } from '@/components';

const meta: Meta<typeof ImageList> = {
  title: 'UX-SDK/ImageList',
  component: ImageList,
};
export default meta;

const Template = (args: any) => {
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

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    imageCarousel: {
      storeName: 'ImageList.stories.carouselStore',
    },
    paginationBar: {
      storeName: 'ImageList.stories.pagingStore',
    },
    context: {
      storeName: 'ImageList.stories.contextStore',
    },
  },
};
