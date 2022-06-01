import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useEffect, useState, useReducer, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PlayIcon } from '@heroicons/react/solid';
import Chart from './Chart';
import { Option } from './Option';
import PaginationBar from '../../PaginationBar';
import ImageCarousel from '../../ImageCarousel';
import { useContextStore } from '../../../stores/contextStore';
import { useCarouselStore } from '../../../stores/carouselStore';
import { usePagingStore } from '../../../stores/pagingStore';
import { useCarouselQueries } from '../../../utils/hooks/useCarouselQueries';
import { useFilterFromDataframe, useSetFiltering } from '../../../utils';
import { Base, EventParams } from './Option/Base';

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

  const { useCarouselSizeQuery, useCarouselPageQuery } = useCarouselQueries({
    contextStore: contextStore,
    pagingStore: pagingStore,
    carouselStore: carouselStore,
  });

  const sizeQuery = useCarouselSizeQuery();
  const pageQuery = useCarouselPageQuery();

  const examples = [
    'Custom',
    'CategoryDistribution_Bar',
    'CategoryDistribution_Pie',
    'ImageSizeDistribution_Scatter',
    'ImageSizeDistribution_Heatmap',
    'BoxSizeDistribution_Scatter',
    'BoxSizeDistribution_Heatmap',
    'AnnotationDateDistribution_Line',
    'AnnotationDateDistribution_Calendar',
  ];
  const [example, setExample] = useState<string>('Custom');

  const { setFiltering } = useSetFiltering({
    pagingStore: pagingStore,
    contextStore: contextStore,
  });

  useEffect(() => {
    const filterOpt = useFilterFromDataframe({ header: [], data: [] });
    setFiltering(filterOpt);
  }, []);

  const optionRef = useRef<Option>(new Base());
  const chartKeyRef = useRef<boolean>(false);
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  const prepareExample = (emp: string) => {
    if (emp === 'Custom') optionRef.current = new Base();
    else if (emp === 'CategoryDistribution_Bar') {
      optionRef.current = Option.makeBar()
        .setData({
          queryApi: {
            host: HOST,
            query:
              'res = df.groupby("category").size().sort_values().to_frame("count")',
          },
        })
        .updateOption({
          grid: {
            left: '4%',
            right: '4%',
            top: '10%',
            bottom: '36%',
          },
          xAxis: {
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              rotate: 45,
            },
          },
          series: [
            {
              name: 'CountOfSamples',
              colorBy: 'data',
              emphasis: {
                focus: 'self',
              },
              selectedMode: 'single',
              select: {
                itemStyle: {
                  borderColor: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                  shadowBlur: 10,
                },
              },
              encode: {
                x: 'category',
                y: 'count',
              },
            },
          ],
        })
        .setBackgroundAction({
          name: 'click',
          action: async (chart: echarts.ECharts) => {
            Option.unselectAll(chart);
            setFiltering(await Option.filterOptionFromQuery(HOST, 'res = df'));
          },
        })
        .addElementAction({
          name: 'click',
          query: 'series',
          action: async (params: EventParams) =>
            setFiltering(
              await Option.filterOptionFromQuery(
                HOST,
                'res = df[df.category == data["category"]]',
                params
              )
            ),
        });
    } else if (emp === 'CategoryDistribution_Pie') {
      optionRef.current = Option.makePie()
        .setData({
          queryApi: {
            host: HOST,
            query:
              'res = df.groupby("category").size().sort_values(ascending=False).to_frame("count")',
          },
        })
        .updateOption({
          legend: { left: 'left' },
          series: [
            {
              name: 'CountOfSamples',
              radius: ['30%', '70%'],
              center: ['75%', '50%'],
              encode: {
                itemName: 'category',
                value: 'count',
              },
            },
          ],
        })
        .setBackgroundAction({
          name: 'click',
          action: async (chart: echarts.ECharts) => {
            // Option.unselectAll(chart);
            setFiltering(await Option.filterOptionFromQuery(HOST, 'res = df'));
          },
        })
        .addElementAction({
          name: 'click',
          query: 'series',
          action: async (params: EventParams) =>
            setFiltering(
              await Option.filterOptionFromQuery(
                HOST,
                'res = df[df.category == data[0]]',
                params
              )
            ),
        });
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

      <div className='h-80'>
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
