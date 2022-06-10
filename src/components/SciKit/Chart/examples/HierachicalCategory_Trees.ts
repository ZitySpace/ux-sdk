import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, queryData, fetchData } from '../Option/Base';
import { ChartTreeDataProps } from '../Option/Tree';

const getRelationData = (HOST: string) => async () => {
  const tree = await fetchData(HOST + '/relation?name=category-supercategory');
  const counts = Object.fromEntries(
    (
      await queryData(
        HOST,
        "res = df.groupby('category').size().to_frame('count')"
      )
    )['data']
  );

  let stack = [];
  let next = [tree];

  // width first traverse of the tree
  while (next.length) {
    const node = next.pop();
    stack.push(node);
    if (node.children) next = [...node.children, ...next];
  }

  // assign count values from leaf to root
  while (stack.length) {
    const node = stack.pop();
    node.value = node.children
      ? node.children.reduce(
          (cnt: number, nd: ChartTreeDataProps) => cnt + nd.value,
          0
        )
      : counts.hasOwnProperty(node.name)
      ? counts[node.name]
      : 0;
  }

  return tree;
};

export const makeOption = (
  treeType: string,
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) => {
  const opt =
    treeType === 'tree'
      ? Option.makeTree()
          .setTreeData(getRelationData(HOST))
          .updateOption({
            series: [
              {
                name: 'CategoryTree',
                orient: 'TB',

                bottom: '32%',
                left: '5%',
                right: '5%',

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

                symbolSize: (value: number) =>
                  (value / 10 > 6 ? 6 : value / 10) + 4,
              },
            ],
          })
      : treeType === 'radialTree'
      ? Option.makeTree()
          .setTreeData(getRelationData(HOST))
          .updateOption({
            series: [
              {
                name: 'CategoryTree',
                layout: 'radial',

                expandAndCollapse: false,
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

                symbolSize: (value: number) =>
                  (value / 10 > 6 ? 6 : value / 10) + 4,
              },
            ],
          })
      : Option.makeBase();

  opt
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
        // find leaf nodes
        let next = [params.data as any];
        let leafs = [];
        while (next.length) {
          const node = next.pop();
          if (node.children) next = [...node.children, ...next];
          else leafs.push(node.name);
        }

        const queryStr =
          "res = df[df.category.isin(leafs)][['image_hash', 'x', 'y', 'w', 'h', 'category']]";
        const queryStrWithData = `global leafs\nleafs = ${JSON.stringify(
          leafs
        )}\n${queryStr}`;

        setFiltering(
          await Option.filterOptionFromQuery(HOST, queryStrWithData, params)
        );
      },
    });

  return opt;
};
