import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import ImageCarousel from '../ImageCarousel';
import ImageList from '../ImageList';
import StoreProvider from './StoreProvider';
import { useHooks } from '../../utils';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'UX-SDK/StoreProvider',
  component: StoreProvider,
} as ComponentMeta<typeof StoreProvider>;

const queryClient = new QueryClient();

const TemplateSimple: ComponentStory<typeof StoreProvider> = (args) => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider {...args}>
      <ImageCarousel />
    </StoreProvider>
  </QueryClientProvider>
);

export const SimpleStory = TemplateSimple.bind({});
SimpleStory.args = {
  filteringInit: { by: 'Category', value: 'shoes' },
};

const TemplateComposite: ComponentStory<typeof StoreProvider> = (args) => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider {...args}>
      <ImageCarousel />
      <ImageList />
    </StoreProvider>
  </QueryClientProvider>
);

export const CompositeStory = TemplateComposite.bind({});
CompositeStory.args = {
  filteringInit: { by: 'Category', value: 'pants' },
};

const Main = () => {
  const { setFiltering } = useHooks();

  const cateToCond = (cate: string | null) =>
    cate ? { by: 'Category', value: cate } : null;

  return (
    <div>
      <button
        onClick={() => {
          setFiltering(cateToCond('shoes'));
        }}
        className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
      >
        shoes
      </button>
      <button
        onClick={() => {
          setFiltering(cateToCond('dresses'));
        }}
        className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
      >
        dresses
      </button>
      <button
        onClick={() => {
          setFiltering(cateToCond('pants'));
        }}
        className='mr-2 px-2 py-1 bg-indigo-400 rounded-xl'
      >
        pants
      </button>
      <ImageCarousel />
      <ImageList />
    </div>
  );
};

const TemplateDynamic: ComponentStory<typeof StoreProvider> = (args) => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Main />
      </StoreProvider>
    </QueryClientProvider>
  );
};

export const DynamicStory = TemplateDynamic.bind({});
