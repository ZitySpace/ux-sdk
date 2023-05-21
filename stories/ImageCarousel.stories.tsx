import { Meta, StoryObj } from '@storybook/react';
import React, { useRef, useEffect } from 'react';
import { useContextStore, usePagingStore, useCarouselStore } from '@/stores';
import { useCarouselSetSize, useCarouselSetPage, QueryProvider } from '@/hooks';
import { ImageCarousel, PaginationBar, Annotator } from '@/components';

const meta: Meta<typeof ImageCarousel> = {
  title: 'UX-SDK/ImageCarousel',
  component: ImageCarousel,
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
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    imageCarousel: {
      storeName: 'ImageCarousel.stories.carouselStore',
    },
    paginationBar: {
      storeName: 'ImageCarousel.stories.pagingStore',
    },
    context: {
      storeName: 'ImageCarousel.stories.contextStore',
    },
  },
};
