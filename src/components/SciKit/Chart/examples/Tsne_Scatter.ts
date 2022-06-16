import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, BrushSelectedEventParams } from '../Option/Base';
import { useFilterFromDataframe } from '../../../../utils';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
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
          name: 'BoxSize',
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
      action: async (params: MouseEventParams, chart: echarts.ECharts) => {
        Option.unselectAll(chart);
        chart.dispatchAction({
          type: 'select',
          seriesName: params.seriesName,
          dataIndex: params.dataIndex,
        });

        setFiltering(
          await Option.filterOptionFromQuery(
            HOST,
            `
res = df[
    (df.image_hash == data['image_hash'])
    & (df.category == data['category'])
    & (df.x == data['x'])
    & (df.y == data['y'])
    & (df.w == data['w'])
    & (df.h == data['h'])
][['image_hash', 'x', 'y', 'w', 'h', 'category']]
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
        setFiltering(
          useFilterFromDataframe({ header: dimensions, data: selected }, true)
        );
      },
    });
