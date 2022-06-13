import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, fetchData } from '../Option/Base';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) => {
  const opt = Option.makeTree()
    .setSize({ height: 640 })
    .setMultiTreeData(
      async () => await fetchData(HOST + '/relation?name=attributes')
    );

  const nTrees = 16;
  const nRows = 2;
  const nTreesEachRow = Math.ceil(nTrees / nRows);
  const [ml, mr, gapx] = [2, 0, 0];
  const [mt, mb, gapy] = [5, 20, 22];

  const getPos = (
    i: number,
    n: number,
    mStart: number = 0,
    mEnd: number = 0,
    gap: number = 0
  ) => {
    const delta = (100 - mStart - mEnd + gap) / n;
    return [mStart + i * delta, 100 - mStart - (i + 1) * delta + gap];
  };

  opt.updateOption({
    series: Array.from({ length: nTrees }, (_, i) => {
      const col = i % nTreesEachRow;
      const row = Math.floor(i / nTreesEachRow);

      const [left, right] = getPos(col, nTreesEachRow, ml, mr, gapx);
      const [top, bottom] = getPos(row, nRows, mt, mb, gapy);

      return {
        orient: 'TB',

        left: `${left}%`,
        right: `${right}%`,
        top: `${top}%`,
        bottom: `${bottom}%`,

        label: {
          position: 'top',
          align: 'center',
        },
        leaves: {
          label: {
            position: 'bottom',
            align: 'right',
            verticalAlign: 'top',
            rotate: 45,
          },
        },

        expandAndCollapse: false,
        roam: false,

        selectedMode: 'single',
        select: {
          itemStyle: {
            color: 'red',
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
            borderWidth: 0,
          },
        },
        emphasis: {
          scale: 2,
          itemStyle: {
            color: 'red',
            shadowBlur: 10,
            shadowColor: 'rgba(0,0,0,0.5)',
            borderWidth: 0,
          },
        },
      };
    }),
  });

  opt
    .setBackgroundAction({
      name: 'click',
      action: async (chart: echarts.ECharts) => {
        Option.unselectAll(chart);
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams, chart: echarts.ECharts) => {
        Option.unselectAll(chart);

        chart.dispatchAction({
          type: 'select',
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });
      },
    });

  return opt;
};
