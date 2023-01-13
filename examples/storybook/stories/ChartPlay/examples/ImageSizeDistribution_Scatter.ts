import { FilterProps } from '@zityspace/ux-sdk/stores';
import { useFilterFromDataframe } from '@zityspace/ux-sdk/hooks';
import {
  Option,
  MouseEventParams,
  BrushSelectedEventParams,
  ChartDatasetProps,
} from '@zityspace/ux-sdk/components';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void }
) =>
  Option.makeScatter()
    .setSize({ height: 320 })
    .setData({
      queryApi: {
        host: HOST,
        query:
          "res = df[['image_hash', 'image_width', 'image_height']].drop_duplicates()",
      },
    })
    .updateOption({
      toolbox: {
        feature: {
          brush: {
            type: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
          },
        },
      },
      brush: {
        throttleType: 'debounce',
        throttleDelay: 500,
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      grid: {
        left: 75,
        right: 45,
      },
      xAxis: {
        name: 'ImageWidth',
        splitLine: {
          show: true,
        },
      },
      yAxis: {
        name: 'ImageHeight',
        nameGap: 50,
        splitLine: {
          show: true,
        },
      },
      series: [
        {
          name: 'ImageSize',
          symbolSize: 8,
          emphasis: {
            focus: 'self',
          },
          selectedMode: 'single',
          select: {
            itemStyle: {
              color: 'red',
              borderWidth: 0,
            },
          },
          encode: {
            x: 'image_width',
            y: 'image_height',
          },
          tooltip: {
            formatter: (params: MouseEventParams) =>
              params.value[0] +
              ': (' +
              params.value[1] +
              ', ' +
              params.value[2] +
              ')',
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
            "res = df[['image_hash', 'image_width', 'image_height']].drop_duplicates()"
          )
        );
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams) => {
        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[(df.image_width == data['image_width']) & (df.image_height == data['image_height'])][['image_hash']].drop_duplicates()",
            params
          )
        );
      },
    })
    .addElementAction({
      name: 'brushSelected',
      action: async (
        params: BrushSelectedEventParams,
        chart: echarts.ECharts
      ) => {
        if (!params.batch[0].areas.length) return;
        const { selected, dimensions } = Option.getBrushedItems(params, chart);
        setFilter(
          useFilterFromDataframe({ header: dimensions, data: selected }, true)
        );
      },
    });
