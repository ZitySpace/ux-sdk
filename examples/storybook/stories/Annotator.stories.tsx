import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import {
  useContextStore,
  usePagingStore,
  useCarouselStore,
} from '@zityspace/ux-sdk/stores';
import {
  useCarouselSetSize,
  useCarouselSetPage,
  QueryProvider,
} from '@zityspace/ux-sdk/hooks';
import { Annotator } from '@zityspace/ux-sdk/components';

export default {
  title: 'UX-SDK/Annotator',
  component: Annotator,
} as ComponentMeta<typeof Annotator>;

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
      <div style={{ height: 540 }}>
        <Annotator carouselStoreName={args.imageCarousel.storeName} />
      </div>
    );
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
    storeName: 'Annotator.stories.carouselStore',
  },
  paginationBar: {
    storeName: 'Annotator.stories.pagingStore',
  },
  context: {
    storeName: 'Annotator.stories.contextStore',
  },
};
