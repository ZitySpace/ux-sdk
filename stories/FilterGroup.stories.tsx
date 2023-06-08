import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider } from '@/hooks';
import { ImageCarousel, ImageList, PaginationBar } from '@/components';
import { useCarouselSetSize, useCarouselSetPage, filterAtom } from '@/atoms';
import { useSetAtom } from 'jotai';

const FilterGroup = () => <></>;

const meta: Meta<typeof FilterGroup> = {
  title: 'UX-SDK/FilterGroup',
  component: FilterGroup,
};
export default meta;

const TemplateSimple = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <>
        <ImageCarousel />
        <PaginationBar />
        <ImageList />
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
  render: () => <TemplateSimple />,
  args: {},
};

const TemplateDynamic = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    const setFilter = useSetAtom(filterAtom);

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div>
        <button
          onClick={() => {
            setFilter({ choice: 'default' });
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          null
        </button>
        <button
          onClick={() => {
            setFilter({ choice: 'byCategory', value: 'shoes' });
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          shoes
        </button>
        <button
          onClick={() => {
            setFilter({ choice: 'byCategory', value: 'dresses' });
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl'
        >
          dresses
        </button>
        <button
          onClick={() => {
            setFilter({ choice: 'byCategory', value: 'pants' });
          }}
          className='us-mr-2 us-px-2 us-py-1 us-bg-indigo-400 us-rounded-xl us-mb-2'
        >
          pants
        </button>
        <>
          <ImageCarousel />
          <PaginationBar />
          <ImageList />
        </>
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
  render: () => <TemplateDynamic />,
  args: {},
};
