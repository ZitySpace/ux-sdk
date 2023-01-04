import { FilteringProps, Option, MouseEventParams } from '@zityspace/ux-sdk';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makePie()
    .setSize({ height: 320 })
    .setData({
      queryApi: {
        host: HOST,
        query:
          "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category']].groupby('category').size().sort_values(ascending=False).to_frame('count')",
      },
    })
    .updateOption({
      legend: {
        left: 'left',
        orient: 'vertical',
      },
      series: [
        {
          name: 'CountOfSamples',
          radius: ['30%', '70%'],
          center: ['75%', '50%'],
          startAngle: 180,
          emphasis: {
            focus: 'self',
          },
          selectedMode: 'single',
          selectedOffset: 15,
          encode: {
            itemName: 'category',
            value: 'count',
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
            "res = df[df.category == data[0]][['image_hash', 'x', 'y', 'w', 'h', 'category']]",
            params
          )
        ),
    });
