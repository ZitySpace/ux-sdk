import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useContextStore, usePagingStore, useCarouselStore } from '@/stores';
import {
  useContextSetFilter,
  useCarouselSetSize,
  useCarouselSetPage,
  QueryProvider,
} from '@/hooks';
import { ImageCarousel, ImageList, PaginationBar } from '@/components';

const StoreGroup = () => <></>;

const meta: Meta<typeof StoreGroup> = {
  title: 'UX-SDK/StoreGroup',
  component: StoreGroup,
};
export default meta;

const TemplateSimple = (args: any) => {
  const Story = () => {
    const contextStore = useContextStore(
      args.context.storeName,
      args.context.storeInit
    );

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
      <>
        <ImageCarousel carouselStoreName={args.imageCarousel.storeName} />
        <PaginationBar pagingStoreName={args.paginationBar.storeName} />
        <ImageList carouselStoreName={args.imageCarousel.storeName} />
      </>
    );
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const SimpleStory: StoryObj<typeof TemplateSimple> = {
  render: (args) => <TemplateSimple {...args} />,
  args: {
    imageCarousel: {
      storeName: 'StoreGroup.simplestory.carouselStore',
    },
    paginationBar: {
      storeName: 'StoreGroup.simplestory.pagingStore',
    },
    context: {
      storeName: 'StoreGroup.simplestory.contextStore',
      storeInit: { filtering: { by: 'Category', value: 'shoes' } },
    },
  },
};

const TemplateDynamic = (args: any) => {
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

    const setContextFilter = useContextSetFilter({
      pagingStore: pagingStore,
      contextStore: contextStore,
    });

    const cateToCond = (cate: string | null) =>
      cate ? { by: 'Category', value: cate } : { by: null };

    if (sizeQuery.isLoading || pageQuery.isLoading) return <></>;

    return (
      <div>
        <button
          onClick={() => {
            setContextFilter(cateToCond(null));
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          null
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('shoes'));
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          shoes
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('dresses'));
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          dresses
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('pants'));
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl us-mb-2'
        >
          pants
        </button>
        {!sizeQuery.isLoading && !pageQuery.isLoading && (
          <>
            <ImageCarousel carouselStoreName={args.imageCarousel.storeName} />
            <PaginationBar pagingStoreName={args.paginationBar.storeName} />
            <ImageList carouselStoreName={args.imageCarousel.storeName} />
          </>
        )}
      </div>
    );
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const DynamicStory: StoryObj<typeof TemplateDynamic> = {
  render: (args) => <TemplateDynamic {...args} />,
  args: {
    imageCarousel: {
      storeName: 'StoreGroup.dynamicstory.carouselStore',
    },
    paginationBar: {
      storeName: 'StoreGroup.dynamicstory.pagingStore',
    },
    context: {
      storeName: 'StoreGroup.dynamicstory.contextStore',
    },
  },
};
