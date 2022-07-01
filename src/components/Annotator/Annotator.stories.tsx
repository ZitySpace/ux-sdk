import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import Annotator from '../Annotator';

import { QueryClient, QueryClientProvider } from 'react-query';
import { useContextStore } from '../../stores/contextStore';
import { usePagingStore } from '../../stores/pagingStore';
import { useCarouselStore } from '../../stores/carouselStore';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';

export default {
  title: 'UX-SDK/Annotator',
  component: Annotator,
} as ComponentMeta<typeof Annotator>;

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
        <Annotator carouselStoreName={args.imageCarousel.storeName} />
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
    storeName: 'Annotator.stories.carouselStore',
  },
  paginationBar: {
    storeName: 'Annotator.stories.pagingStore',
  },
  context: {
    storeName: 'Annotator.stories.contextStore',
  },
};
