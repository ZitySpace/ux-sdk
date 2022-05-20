import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import Chart, { EventParams } from './Chart';
import { useDataframeStore } from '../../../stores/dataframeStore';

export default {
  title: 'UX-SDK/Chart',
  component: Chart,
} as ComponentMeta<typeof Chart>;

const Template: ComponentStory<any> = (args) => {
  const dataframeStore = useDataframeStore(
    args.datasets.E.dataframeStoreName,
    args.datasets.A
  );

  const [opt, setOpt] = useState<string>('A');

  return (
    <>
      <div className='p-2'>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((o, i) => (
          <button
            onClick={() => {
              setOpt(o);
            }}
            className='mr-2 px-8 py-1 bg-indigo-400 rounded-xl'
            key={i}
          >
            {o}
          </button>
        ))}
      </div>
      <div className='h-64'>
        <Chart {...args.common} dataset={args.datasets[opt]} key={opt} />
      </div>
    </>
  );
};

export const Story = Template.bind({});
Story.args = {
  common: {
    title: 'Chart Preview',
    option: {
      toolbox: {
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
        show: true,
      },
      grid: {
        left: '8%',
        right: '5%',
        top: '18%',
        bottom: '20%',
        containLabel: false,
        show: false,
      },
      dataZoom: {
        type: 'inside',
        orient: 'vertical',
        filterMode: 'none',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'ValueOfDay',
          type: 'bar',
          showBackground: false,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
          encode: {
            x: 'Day',
            y: 'Value',
          },
        },
      ],
    },
    elementActions: [
      {
        actionName: 'click',
        elementQuery: { seriesName: 'ValueOfDay' },
        action: (params: EventParams) => console.log(params.data),
      },
    ],
    resetAction: {
      actionName: 'click',
      action: () => console.log('reset: background clicked'),
    },
  },
  datasets: {
    A: {
      header: ['Day', 'Value'],
      data: [
        ['Mon', 120],
        ['Tue', 200],
        ['Wed', 150],
        ['Thu', 80],
        ['Fri', 70],
        ['Sat', 110],
        ['Sun', 130],
      ],
    },
    B: {
      data: [
        ['Day', 'OldValue', 'Value'],
        ['Mon', 120, 130],
        ['Tue', 200, 110],
        ['Wed', 150, 70],
        ['Thu', 80, 80],
        ['Fri', 70, 150],
        ['Sat', 110, 200],
        ['Sun', 130, 120],
      ],
    },
    C: {
      data: {
        Day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        Value: [200, 120, 80, 150, 110, 130, 70],
      },
    },
    D: {
      data: [
        { Day: 'Mon', Value: 150 },
        { Day: 'Tue', Value: 200 },
        { Day: 'Wed', Value: 120 },
        { Day: 'Thu', Value: 110 },
        { Day: 'Fri', Value: 70 },
        { Day: 'Sat', Value: 80 },
        { Day: 'Sun', Value: 130 },
      ],
    },
    E: {
      dataframeStoreName: 'Chart.stories.dataframeStore',
    },
    F: {
      jsonUri:
        'https://mock-api-static-files.oss-cn-shenzhen.aliyuncs.com/ux-sdk/Chart.stories.data.json',
    },
  },
};
