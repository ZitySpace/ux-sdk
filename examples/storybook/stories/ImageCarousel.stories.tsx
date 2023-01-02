import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  ImageCarousel,
  PaginationBar,
  Annotator,
  useContextStore,
  usePagingStore,
  useCarouselStore,
  useCarouselQueries,
} from '@zityspace/ux-sdk';

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
      <div className='flex flex-col space-y-4'>
        <div className='shadow-lg'>
          <ImageCarousel carouselStoreName={args.imageCarousel.storeName} />
          <PaginationBar pagingStoreName={args.paginationBar.storeName} />
        </div>
        <div style={{ height: 540 }}>
          <Annotator carouselStoreName={args.imageCarousel.storeName} />
        </div>
      </div>
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
