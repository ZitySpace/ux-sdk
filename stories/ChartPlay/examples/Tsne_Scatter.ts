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
    .setSize({ height: 540 })
    .setData({
      queryApi: {
        host: HOST + '/dimensionality_reduction?gridify=false&method=tsne',
        query: '',
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
        top: '22%',
        bottom: '5%',
        left: '18%',
        right: '15%',
      },
      legend: {
        left: 'left',
        top: '5%',
        orient: 'horizontal',
        selectedMode: 'multiple',
      },
      xAxis: {
        name: 'EmbedX',
        splitLine: {
          show: false,
        },
        show: false,
      },
      yAxis: {
        name: 'EmbedY',
        nameGap: 50,
        splitLine: {
          show: false,
        },
        show: false,
      },
      series: [
        {
          name: 'TSNE',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
          selectedMode: 'single',
          select: {
            itemStyle: {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowBlur: 10,
            },
          },
          encode: {
            x: 'ex',
            y: 'ey',
            tooltip: 'category',
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
          dataIndex: params.dataIndex,
        });

        setFilter(
          await Option.filterFromQuery(
            HOST,
            `
res = df[
    (df.image_hash == data['image_hash'])
    & (df.category == data['category'])
    & (df.x == data['x'])
    & (df.y == data['y'])
    & (df.w == data['w'])
    & (df.h == data['h'])
][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]
            `,
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
