import { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState, useRef } from 'react';

import { QueryProvider, useCarouselSetSize, useCarouselSetPage } from '@/hooks';
import { Chart, Option, PaginationBar, ImageCarousel } from '@/components';
import { filterAtom } from '@/atoms';
import { useSetAtom } from 'jotai';

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

const meta: Meta<typeof Chart> = {
  title: 'UX-SDK/ChartPlay',
  component: Chart,
};
export default meta;

const HOST = 'http://localhost:8008';

const ChartPlay = () => {
  const { isLoading: isSizeLoading } = useCarouselSetSize();
  const { isLoading: isPageLoading } = useCarouselSetPage();

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

  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter({
      choice: 'byDataframe',
      value: {
        header: [],
        data: [],
        selected: [],
      },
    });
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

  if (isSizeLoading || isPageLoading) return <></>;

  return (
    <div className='us-flex us-flex-col us-space-y-4'>
      <div className='us-relative us-flex us-items-center us-w-full'>
        <div className='us-flex-grow us-border-t us-border-indigo-200'></div>
        <span className='us-flex-shrink us-mx-4 us-text-indigo-400 us-text-xl us-font-semibold'>
          Chart Examples
        </span>
        <div className='us-flex-grow us-border-t us-border-indigo-200'></div>
      </div>
      <div className='us-flex us-flex-wrap'>
        {examples.map((emp, i) => (
          <button
            type='button'
            key={i}
            className={`us-mr-4 us-mb-2 us-inline-flex us-justify-center us-items-center us-px-3.5 us-py-2 us-border
                  us-text-xs us-font-semibold us-rounded-lg us-shadow-sm
                  hover:us-border-indigo-600 hover:us-ring-1 hover:us-ring-indigo-600
                  ${
                    example === emp
                      ? 'us-text-gray-50 us-bg-indigo-600 us-outline-none'
                      : 'us-text-gray-600 us-bg-transparent us-border-gray-400'
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

      <div className='us-h-full'>
        <Chart
          title='Chart'
          option={optionRef.current}
          key={chartKeyRef.current ? 'A' : 'B'}
        />
      </div>
      <div>
        <ImageCarousel />
        <PaginationBar />
      </div>
    </div>
  );
};

const Template = () => {
  return (
    <QueryProvider>
      <ChartPlay />
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: () => <Template />,
  args: {},
};
