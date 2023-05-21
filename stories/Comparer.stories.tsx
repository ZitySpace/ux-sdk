import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useCarouselStore, usePagingStore, useContextStore } from '@/stores';
import { useCarouselSetSize, useCarouselSetPage, QueryProvider } from '@/hooks';
import { Comparer, ImageTag } from '@/components';

const meta: Meta<typeof Comparer> = {
  title: 'UX-SDK/Comparer',
  component: Comparer,
};
export default meta;

const factory =
  (Component: React.FC<any>, params: any) =>
  ({ name }: { name: string }) => {
    return <Component name={name} {...params} />;
  };

const Template = (args: any) => {
  const Story = () => {
    const contextStore = useContextStore(args.context.storeName);
    const pagingStore = usePagingStore(args.paginationBar.storeName);
    const carouselStore = useCarouselStore(args.imageCarousel.storeName);

    const setCarouselSize = useCarouselSetSize({
      contextStore,
      pagingStore,
    });
    const setCarouselPage = useCarouselSetPage({
      contextStore,
      pagingStore,
      carouselStore,
    });

    const sizeQuery = setCarouselSize();
    const pageQuery = setCarouselPage();

    if (sizeQuery.isLoading || pageQuery.isLoading) return <></>;

    return (
      <Comparer
        Components={args.Components}
        pagingStoreName={args.paginationBar.storeName}
        carouselStoreName={args.imageCarousel.storeName}
      />
    );
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

const storeNames = {
  imageCarousel: {
    storeName: 'Comparer.stories.carouselStore',
  },
  paginationBar: {
    storeName: 'Comparer.stories.pagingStore',
  },
  context: {
    storeName: 'Comparer.stories.contextStore',
  },
};
export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    Components: [ImageTag, ImageTag].map((c) =>
      factory(c, { carouselStoreName: storeNames.imageCarousel.storeName })
    ),
    ...storeNames,
  },
};
