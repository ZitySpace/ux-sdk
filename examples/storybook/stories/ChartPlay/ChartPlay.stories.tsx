import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useEffect, useState, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import {
  useContextStore,
  useCarouselStore,
  usePagingStore,
} from '@zityspace/ux-sdk/stores';
import {
  useFilterFromDataframe,
  useContextSetFilter,
  useCarouselSetSize,
  useCarouselSetPage,
} from '@zityspace/ux-sdk/hooks';
import {
  Chart,
  Option,
  PaginationBar,
  ImageCarousel,
} from '@zityspace/ux-sdk/components';

import {
  makeCategoryDistributionBarOption,
  makeCategoryDistributionPieOption,
  makeBoxSizeDistributionScatterOption,
  makeImageSizeDistributionScatterOption,
  makeAnnotationTimeTrackerOption,
  makeHierachicalCategoryRelationOption,
  makeAttributeForestOption,
  makeCategoryAttributeSankeyOption,
  makeTsneOption,
  makeTsne3DOption,
  makeConfusionMatrixOption,
} from './examples';

export default {
  title: 'UX-SDK/ChartPlay',
  component: Chart,
} as ComponentMeta<typeof Chart>;

const HOST = 'http://localhost:8008';

const ChartPlay = ({
  contextStoreName = '.contextStore',
  pagingStoreName = '.pagingStore',
  carouselStoreName = '.carouselStore',
}: {
  contextStoreName?: string;
  pagingStoreName?: string;
  carouselStoreName?: string;
}) => {
  const contextStore = useContextStore(contextStoreName);
  const pagingStore = usePagingStore(pagingStoreName);
  const carouselStore = useCarouselStore(carouselStoreName);

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

  const examples = [
    'Custom',
    'CategoryDistribution_Bar',
    'CategoryDistribution_Pie',
    'ImageSizeDistribution_Scatter',
    'BoxSizeDistribution_Scatter',
    'AnnotationTimeTracker_Line',
    'AnnotationYearlyTracker_Calendar',
    'AnnotationMonthlyTracker_Calendar',
    'ConfusionMatrix_Heatmap',
    'MultiLabelConfusionMatrix_Heatmap',
    'Tsne_Scatter',
    'Tsne_Scatter3D',
    'HierachicalCategory_Tree',
    'HierachicalCategory_RadialTree',
    'HierachicalCategory_TreeMap',
    'HierachicalCategory_Sunburst',
    'MultiLabel_Forest',
    'CategoryAttribute_Sankey',
  ];
  const [example, setExample] = useState<string>('Custom');

  const setFilter = useContextSetFilter({
    pagingStore: pagingStore,
    contextStore: contextStore,
  });

  useEffect(() => {
    const filter = useFilterFromDataframe({ header: [], data: [] });
    setFilter(filter);
  }, []);

  const optionRef = useRef<Option>(new Option());
  const chartKeyRef = useRef<boolean>(false);

  const prepareExample = (emp: string) => {
    if (emp === 'Custom') optionRef.current = new Option();
    else if (emp === 'CategoryDistribution_Bar') {
      optionRef.current = makeCategoryDistributionBarOption(HOST, setFilter);
    } else if (emp === 'CategoryDistribution_Pie') {
      optionRef.current = makeCategoryDistributionPieOption(HOST, setFilter);
    } else if (emp === 'BoxSizeDistribution_Scatter') {
      optionRef.current = makeBoxSizeDistributionScatterOption(HOST, setFilter);
    } else if (emp === 'ImageSizeDistribution_Scatter') {
      optionRef.current = makeImageSizeDistributionScatterOption(
        HOST,
        setFilter
      );
    } else if (emp === 'AnnotationYearlyTracker_Calendar') {
      optionRef.current = makeAnnotationTimeTrackerOption(
        'yearlyCalendar',
        HOST,
        setFilter
      );
    } else if (emp === 'AnnotationMonthlyTracker_Calendar') {
      optionRef.current = makeAnnotationTimeTrackerOption(
        'monthlyCalendar',
        HOST,
        setFilter
      );
    } else if (emp === 'AnnotationTimeTracker_Line') {
      optionRef.current = makeAnnotationTimeTrackerOption(
        'timeLine',
        HOST,
        setFilter
      );
    } else if (emp === 'Tsne_Scatter') {
      optionRef.current = makeTsneOption(HOST, setFilter);
    } else if (emp === 'Tsne_Scatter3D') {
      optionRef.current = makeTsne3DOption(HOST, setFilter);
    } else if (emp === 'ConfusionMatrix_Heatmap') {
      optionRef.current = makeConfusionMatrixOption(HOST, setFilter, false);
    } else if (emp === 'MultiLabelConfusionMatrix_Heatmap') {
      optionRef.current = makeConfusionMatrixOption(HOST, setFilter, true);
    } else if (emp === 'HierachicalCategory_Tree') {
      optionRef.current = makeHierachicalCategoryRelationOption(
        'tree',
        HOST,
        setFilter
      );
    } else if (emp === 'HierachicalCategory_RadialTree') {
      optionRef.current = makeHierachicalCategoryRelationOption(
        'radialTree',
        HOST,
        setFilter
      );
    } else if (emp === 'HierachicalCategory_TreeMap') {
      optionRef.current = makeHierachicalCategoryRelationOption(
        'treemap',
        HOST,
        setFilter
      );
    } else if (emp === 'HierachicalCategory_Sunburst') {
      optionRef.current = makeHierachicalCategoryRelationOption(
        'sunburst',
        HOST,
        setFilter
      );
    } else if (emp === 'MultiLabel_Forest') {
      optionRef.current = makeAttributeForestOption(HOST, setFilter);
    } else if (emp === 'CategoryAttribute_Sankey') {
      optionRef.current = makeCategoryAttributeSankeyOption(HOST, setFilter);
    }

    if (emp !== example) {
      chartKeyRef.current = !chartKeyRef.current;
    }
  };

  return (
    <div className='flex flex-col space-y-4'>
      <div className='relative flex items-center w-full'>
        <div className='flex-grow border-t border-indigo-200'></div>
        <span className='flex-shrink mx-4 text-indigo-400 text-xl font-semibold'>
          Chart Examples
        </span>
        <div className='flex-grow border-t border-indigo-200'></div>
      </div>
      <div className='flex flex-wrap'>
        {examples.map((emp, i) => (
          <button
            type='button'
            key={i}
            className={`mr-4 mb-2 inline-flex justify-center items-center px-3.5 py-2 border
                  text-xs font-semibold rounded-lg shadow-sm
                  hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                  ${
                    example === emp
                      ? 'text-gray-50 bg-indigo-600 outline-none'
                      : 'text-gray-600 bg-transparent border-gray-400'
                  }`}
            onClick={() => {
              prepareExample(emp);
              setExample(emp);
            }}
          >
            {emp}
          </button>
        ))}
      </div>

      <div className='h-full'>
        <Chart
          title='Chart'
          option={optionRef.current}
          key={chartKeyRef.current ? 'A' : 'B'}
        />
      </div>
      <div>
        <ImageCarousel carouselStoreName={carouselStoreName} />
        <PaginationBar pagingStoreName={pagingStoreName} />
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const Template: ComponentStory<any> = (args) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChartPlay {...args} />
    </QueryClientProvider>
  );
};

export const Story = Template.bind({});
Story.args = {
  contextStoreName: 'ChartEditor.stories.contextStore',
  pagingStoreName: 'ChartEditor.stories.pagingStore',
  carouselStoreName: 'ChartEditor.stories.carouselStore',
};
