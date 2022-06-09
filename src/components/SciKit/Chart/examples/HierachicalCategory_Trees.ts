import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams } from '../Option/Base';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makeTree()
    .setData({
      //   queryApi: {
      //     host: HOST,
      //     query: '',
      //   },

      name: 'rui',
      children: [
        { name: 'A', value: 10 },
        { name: 'B', value: 8 },
      ],
    })
    .updateOption({
      series: [
        {
          name: 'CategoryTree',
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
//         "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category']]"
//       )
//     );
//   },
// })
// .addElementAction({
//   name: 'click',
//   query: 'series',
//   action: async (params: MouseEventParams) =>
//     setFiltering(
//       await Option.filterOptionFromQuery(
//         HOST,
//         "res = df[df.category == data['category']][['image_hash', 'x', 'y', 'w', 'h', 'category']]",
//         params
//       )
//     ),
// });
