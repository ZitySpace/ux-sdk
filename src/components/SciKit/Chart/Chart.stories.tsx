import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import * as echarts from 'echarts';
import Chart from './Chart';
import { Option } from './Option';
import { EventParams } from './Option/Base';
import { useDataframeStore } from '../../../stores/dataframeStore';
import { useStore } from 'zustand';

export default {
  title: 'UX-SDK/Chart',
  component: Chart,
} as ComponentMeta<typeof Chart>;

const Template: ComponentStory<any> = (args) => {
  const datasetFromDF = useStore(
    useDataframeStore(args.datasets.E.dataframeStoreName, args.datasets.A),
    (s) => ({
      header: s.header,
      data: s.data,
    })
  );

  const [opt, setOpt] = useState<string>('A');

  const option = Option.makeBar()
    .setData(opt === 'E' ? datasetFromDF : args.datasets[opt])
    .setX(opt === 'G' ? 'category' : 'Day')
    .setY(opt === 'G' ? 'count' : 'Value')
    .updateOption({
      series: [
        {
          colorBy: 'data',
          emphasis: {
            focus: 'self',
          },
          selectedMode: 'multiple',
          select: {
            itemStyle: {
              borderColor: 'rgba(0,0,0,0)',
              borderWidth: 0,
              shadowBlur: 10,
            },
          },
        },
      ],
    })
    .setBackgroundAction({
      name: 'click',
      action: (chart: echarts.ECharts) => {
        console.log('background clicked');
        Option.unselectAll(chart);
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: (params: EventParams) => {
        console.log(params.data);
      },
    });

  return (
    <>
      <div className='p-2'>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((o, i) => (
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
        <Chart title='Chart Preview' option={option} key={opt} />
      </div>
    </>
  );
};

export const Story = Template.bind({});
Story.args = {
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
    G: {
      queryApi: {
        host: 'http://localhost:8008',
        query: 'res = df.groupby("category").size().to_frame("count").head(10)',
      },
    },
  },
};
