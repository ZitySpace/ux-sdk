import { FilterProps } from '@/atoms';
import { Option, MouseEventParams } from '@/components';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void }
) =>
  Option.makeBar()
    .setSize({ height: 320 })
    .setData({
      queryApi: {
        host: HOST,
        query:
          "res = df.groupby('category').size().sort_values().to_frame('count')",
      },
    })
    .updateOption({
      grid: {
        left: '6%',
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
      yAxis: {
        name: 'num of samples',
        nameGap: 40,
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
        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]"
          )
        );
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams) =>
        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[df.category == data['category']][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]",
            params
          )
        ),
    });
