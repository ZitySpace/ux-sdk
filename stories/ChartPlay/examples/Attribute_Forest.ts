import { FilterProps } from '@/atoms';
import { Option, MouseEventParams, fetchData } from '@/components';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void }
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

        symbolSize: (value: number) => (value / 10 > 6 ? 6 : value / 10) + 4,
      };
    }),
  });

  opt
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
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });

        const path = (params as any).treeAncestors
          .slice(1)
          .map((n: any) => n.name)
          .join('.');

        const queryStr = `
global check
def check(path, anno):
    names = path.split('.')

    cur = anno
    while names:
        name = names.pop(0)
        if isinstance(cur, str):
            if not names and (name == cur or name in cur.split(';')):
                return True
            return False

        if name not in cur:
            return False

        cur = anno[name]

    return True

slice = df[df.attributes.apply(lambda x: check('${path}', ast.literal_eval(x)))]

res = slice[['image_hash', 'x', 'y', 'w', 'h', 'type']]
        `;

        setFilter(await Option.filterFromQuery(HOST, queryStr));
      },
    });

  return opt;
};
