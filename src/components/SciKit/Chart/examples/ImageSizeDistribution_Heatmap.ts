import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, BrushSelectedEventParams } from '../Option/Base';
import { useFilterFromDataframe } from '../../../../utils';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makeHeatmap()
    .setData({
      queryApi: {
        host: HOST,
        query:
          "res = df[['image_hash', 'image_width', 'image_height']].drop_duplicates().groupby(by=['image_width', 'image_height']).size().to_frame('count')",
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
        left: '40%',
        right: '40%',
      },
      animation: false,
      dataZoom: [
        {
          type: 'inside',
          filterMode: 'empty',
        },
        { type: 'inside', orient: 'vertical', filterMode: 'empty' },
      ],
      visualMap: {
        type: 'continuous',
        dimension: 'count',
        min: 0,
        max: 60,
        show: false,
      },
      xAxis: {
        name: 'ImageWidth',
        type: 'value',
      },
      yAxis: {
        name: 'ImageHeight',
        nameGap: 50,
        type: 'value',
      },
      series: [
        {
          name: 'ImageSize',
          pointSize: 50,
          blueSize: 50,
          emphasis: {
            focus: 'self',
          },
          selectedMode: 'single',
          encode: {
            x: 'image_width',
            y: 'image_height',
          },
          tooltip: {
            formatter: (params: MouseEventParams) =>
              '(' +
              params.value[0] +
              ', ' +
              params.value[1] +
              ') : ' +
              params.value[2],
          },
        },
      ],
    });
// .setBackgroundAction({
//   name: 'click',
//   action: async (chart: echarts.ECharts) => {
//     Option.unselectAll(chart);
//     setFiltering(
//       await Option.filterOptionFromQuery(
//         HOST,
//         "res = df[['image_hash', 'image_width', 'image_height']].drop_duplicates()"
//       )
//     );
//   },
// })
// .addElementAction({
//   name: 'click',
//   query: 'series',
//   action: async (params: MouseEventParams) => {
//     setFiltering(
//       await Option.filterOptionFromQuery(
//         HOST,
//         "res = df[(df.image_width == data['image_width']) & (df.image_height == data['image_height'])][['image_hash']].drop_duplicates()",
//         params
//       )
//     );
//   },
// })
// .addElementAction({
//   name: 'brushSelected',
//   action: async (
//     params: BrushSelectedEventParams,
//     chart: echarts.ECharts
//   ) => {
//     if (!params.batch[0].areas.length) return;
//     const { selected, dimensions } = Option.getBrushedItems(
//       params,
//       chart
//     );
//     setFiltering(
//       useFilterFromDataframe(
//         { header: dimensions, data: selected },
//         true
//       )
//     );
//   },
// });
