import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Comparer from './Comparer';
import ImageTag from '../ImageTag';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useCarouselStore } from '../../stores/carouselStore';

import { usePagingStore } from '../../stores/pagingStore';

import { useContextStore } from '../../stores/contextStore';

import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';

export default {
  title: 'UX-SDK/Comparer',
  component: Comparer,
} as ComponentMeta<typeof Comparer>;

const queryClient = new QueryClient();

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

    const { useCarouselSizeQuery, useCarouselPageQuery } = useCarouselQueries({
      contextStore: contextStore,
      pagingStore: pagingStore,
      carouselStore: carouselStore,
    });

    const sizeQuery = useCarouselSizeQuery();
    const pageQuery = useCarouselPageQuery();

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
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
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
