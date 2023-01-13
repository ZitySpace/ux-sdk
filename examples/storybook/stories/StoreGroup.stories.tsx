import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  useContextStore,
  usePagingStore,
  useCarouselStore,
} from '@zityspace/ux-sdk/stores';
import {
  useContextSetFilter,
  useCarouselSetSize,
  useCarouselSetPage,
} from '@zityspace/ux-sdk/hooks';
import {
  ImageCarousel,
  ImageList,
  PaginationBar,
} from '@zityspace/ux-sdk/components';

const StoreGroup = () => <></>;

export default {
  title: 'UX-SDK/StoreGroup',
  component: StoreGroup,
} as ComponentMeta<typeof StoreGroup>;

const queryClient = new QueryClient();

const TemplateSimple: ComponentStory<any> = (args) => {
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
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

export const SimpleStory = TemplateSimple.bind({});
SimpleStory.args = {
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
};

const TemplateDynamic: ComponentStory<any> = (args) => {
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
          className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
        >
          null
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('shoes'));
          }}
          className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
        >
          shoes
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('dresses'));
          }}
          className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
        >
          dresses
        </button>
        <button
          onClick={() => {
            setContextFilter(cateToCond('pants'));
          }}
          className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
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
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

export const DynamicStory = TemplateDynamic.bind({});
DynamicStory.args = {
  imageCarousel: {
    storeName: 'StoreGroup.dynamicstory.carouselStore',
  },
  paginationBar: {
    storeName: 'StoreGroup.dynamicstory.pagingStore',
  },
  context: {
    storeName: 'StoreGroup.dynamicstory.contextStore',
  },
};
