import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';
import PaginationBar from '../PaginationBar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useContextStore } from '../../stores/contextStore';
import { usePagingStore } from '../../stores/pagingStore';
import { useCarouselStore } from '../../stores/carouselStore';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';

export default {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
} as ComponentMeta<typeof ImageCarousel>;

const queryClient = new QueryClient();

const Template: ComponentStory<any> = (args) => {
  const Story = () => {
    const mounted = useRef(false);
    useEffect(() => {
      mounted.current = true;
    }, []);

    const contextStore = useContextStore(args.context.storeName);
    const pagingStore = usePagingStore(
      args.paginationBar.storeName,
      { pos: 0 },
      !mounted.current
    );
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
      <>
        <ImageCarousel storeName={args.imageCarousel.storeName} />
        <PaginationBar storeName={args.paginationBar.storeName} />
      </>
    );
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
    storeName: 'ImageCarousel.stories.carouselStore',
  },
  paginationBar: {
    storeName: 'ImageCarousel.stories.pagingStore',
  },
  context: {
    storeName: 'ImageCarousel.stories.contextStore',
  },
};
