import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams } from '../Option/Base';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makeBar()
    .setData({
      queryApi: {
        host: HOST,
        query:
          "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category']].groupby('category').size().sort_values().to_frame('count')",
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
        setFiltering(
          await Option.filterOptionFromQuery(
            HOST,
            "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category']]"
          )
        );
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams) =>
        setFiltering(
          await Option.filterOptionFromQuery(
            HOST,
            "res = df[df.category == data['category']][['image_hash', 'x', 'y', 'w', 'h', 'category']]",
            params
          )
        ),
    });
