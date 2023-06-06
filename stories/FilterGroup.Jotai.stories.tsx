import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider } from '@/hooks';
import {
  JotaiImageCarousel,
  JotaiImageList,
  JotaiPaginationBar,
} from '@/components';
import {
  useJotaiCarouselSetSize,
  useJotaiCarouselSetPage,
  filterAtom,
} from '@/atoms';
import { useSetAtom } from 'jotai';

const FilterGroup = () => <></>;

const meta: Meta<typeof FilterGroup> = {
  title: 'UX-SDK/FilterGroup',
  component: FilterGroup,
};
export default meta;

const TemplateSimple = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useJotaiCarouselSetSize();
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <>
        <JotaiImageCarousel />
        <JotaiPaginationBar />
        <JotaiImageList />
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
    const { isLoading: isSizeLoading } = useJotaiCarouselSetSize();
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

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
          <JotaiImageCarousel />
          <JotaiPaginationBar />
          <JotaiImageList />
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
