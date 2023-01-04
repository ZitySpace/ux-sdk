import { FilteringProps, Option, MouseEventParams } from '@zityspace/ux-sdk';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makeScatter3D()
    .setSize({ height: 640 })
    .setData({
      queryApi: {
        host:
          HOST + '/dimensionality_reduction?gridify=false&method=tsne&ndim=3',
        query: '',
      },
    })
    .updateOption({
      legend: {
        left: 'left',
        top: '5%',
        orient: 'horizontal',
        selectedMode: 'multiple',
      },

      grid3D: {
        show: true,
        viewControl: {
          autoRotate: false,
        },
      },
      xAxis3D: {
        show: false,
      },
      yAxis3D: {
        show: false,
      },
      zAxis3D: {
        show: false,
      },

      series: [
        {
          name: 'TSNE3D',
          symbolSize: 6,

          encode: {
            x: 'ex',
            y: 'ey',
            z: 'ez',
            tooltip: 'category',
          },
        },
      ],
    })
    .setColor('category')
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams) => {
        setFiltering(
          await Option.filterOptionFromQuery(
            HOST,
            `
res = df[
    (df.image_hash == data[0])
    & (df.category == data[5])
    & (df.x == data[1])
    & (df.y == data[2])
    & (df.w == data[3])
    & (df.h == data[4])
][['image_hash', 'x', 'y', 'w', 'h', 'category']]
            `,
            params
          )
        );
      },
    });
