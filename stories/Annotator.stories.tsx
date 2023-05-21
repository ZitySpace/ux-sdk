import { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import { useContextStore, usePagingStore, useCarouselStore } from '@/stores';
import { useCarouselSetSize, useCarouselSetPage, QueryProvider } from '@/hooks';
import { Annotator } from '@/components';

const meta: Meta<typeof Annotator> = {
  title: 'UX-SDK/Annotator',
  component: Annotator,
};
export default meta;

const Template = (args: any) => {
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

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    imageCarousel: {
      storeName: 'Annotator.stories.carouselStore',
    },
    paginationBar: {
      storeName: 'Annotator.stories.pagingStore',
    },
    context: {
      storeName: 'Annotator.stories.contextStore',
    },
  },
};
