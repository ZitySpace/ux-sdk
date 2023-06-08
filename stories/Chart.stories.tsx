import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import * as echarts from 'echarts';
import { Chart, Option, MouseEventParams } from '@/components';

const meta: Meta<typeof Chart> = {
  title: 'UX-SDK/Chart',
  component: Chart,
};
export default meta;

const Template = (args: any) => {
  const [opt, setOpt] = useState<string>('A');

  const option = Option.makeBar()
    .setData(args.datasets[opt])
    .setX(opt === 'F' ? 'category' : 'Day')
    .setY(opt === 'F' ? 'count' : 'Value')
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
      action: (params: MouseEventParams) => {
        console.log(params.data);
      },
    });

  return (
    <>
      <div className='us-p-2'>
        {['A', 'B', 'C', 'D', 'E', 'F'].map((o, i) => (
          <button
            onClick={() => {
              setOpt(o);
            }}
            className='us-mr-2 us-px-8 us-py-1 us-bg-indigo-400 us-rounded-xl'
            key={i}
          >
            {o}
          </button>
        ))}
      </div>
      <div className='us-h-64'>
        <Chart title='Chart Preview' option={option} key={opt} />
      </div>
    </>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
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
        jsonUri:
          'https://mock-api-static-files.oss-cn-shenzhen.aliyuncs.com/ux-sdk/Chart.stories.data.json',
      },
      F: {
        queryApi: {
          host: 'http://localhost:8008',
          query:
            'res = df.groupby("category").size().to_frame("count").head(10)',
        },
      },
    },
  },
};
