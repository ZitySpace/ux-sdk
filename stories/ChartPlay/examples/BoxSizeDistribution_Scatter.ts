import { FilterProps, filterAtomMap } from '@/atoms';
import {
  Option,
  MouseEventParams,
  BrushSelectedEventParams,
} from '@/components';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void }
) =>
  Option.makeScatter()
    .setSize({ height: 320 })
    .setData({
      queryApi: {
        host: HOST,
        query: 'res = df',
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
        left: '50%',
      },
      legend: {
        left: 'left',
        orient: 'vertical',
        selectedMode: 'multiple',
      },
      xAxis: {
        name: 'BoxWidth',
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        name: 'BoxHeight',
        nameGap: 50,
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: 'BoxSize',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
          selectedMode: 'series',
          encode: {
            x: 'w',
            y: 'h',
            tooltip: ['w', 'h', 'category'],
          },
        },
      ],
    })
    .setColor('category')
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
      action: async (params: MouseEventParams, chart: echarts.ECharts) => {
        Option.unselectAll(chart);
        chart.dispatchAction({
          type: 'select',
          seriesName: params.seriesName,
          dataIndex: Array.from({ length: 10000 }, (_, i) => i),
        });

        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[df.category == data['category']][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]",
            false,
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
        setFilter({
          choice: 'byDataframeGroupByImage' as keyof typeof filterAtomMap,
          value: {
            header: dimensions,
            data: selected,
            selected: Array(selected.length).fill(false),
          },
        });
      },
    });
