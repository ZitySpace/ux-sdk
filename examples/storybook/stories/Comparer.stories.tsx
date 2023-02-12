import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import {
  useCarouselStore,
  usePagingStore,
  useContextStore,
} from '@zityspace/ux-sdk/stores';
import {
  useCarouselSetSize,
  useCarouselSetPage,
  QueryProvider,
} from '@zityspace/ux-sdk/hooks';
import { Comparer, ImageTag } from '@zityspace/ux-sdk/components';

export default {
  title: 'UX-SDK/Comparer',
  component: Comparer,
} as ComponentMeta<typeof Comparer>;

const factory =
  (Component: React.FC<any>, params: any) =>
  ({ name }: { name: string }) => {
    return <Component name={name} {...params} />;
  };

const Template: ComponentStory<any> = (args) => {
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

export const Story = Template.bind({});
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
Story.args = {
  Components: [ImageTag, ImageTag].map((c) =>
    factory(c, { carouselStoreName: storeNames.imageCarousel.storeName })
  ),
  ...storeNames,
};
