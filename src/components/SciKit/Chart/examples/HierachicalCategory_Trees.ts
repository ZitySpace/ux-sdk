import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, queryData, fetchData } from '../Option/Base';
import { ChartTreeDataProps } from '../Option/Tree';

const getRelationData = (HOST: string) => async () =>
  await fetchData(HOST + '/relation?name=categories');

export const makeOption = (
  treeType: string,
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) => {
  const opt =
    treeType === 'tree'
      ? Option.makeTree()
          .setSize({ height: 320 })
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
          .setSize({ height: 360 })
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
      : treeType === 'treemap'
      ? Option.makeTreemap()
          .setSize({ height: 360 })
          .setTreeData(getRelationData(HOST))
          .updateOption({
            series: [
              {
                name: 'CategoryTreemap',
              },
            ],
          })
      : treeType === 'sunburst'
      ? Option.makeSunburst()
          .setSize({ height: 480 })
          .setTreeData(getRelationData(HOST))
          .updateOption({
            series: [
              {
                name: 'CategorySunburst',
                levels: [
                  {},
                  {
                    r0: '10%',
                    r: '60%',
                    itemStyle: {
                      borderWidth: 2,
                    },
                    label: {
                      align: 'right',
                    },
                  },
                  {
                    r0: '60%',
                    r: '65%',
                    label: {
                      position: 'outside',
                      padding: 3,
                      silent: false,
                    },
                    itemStyle: {
                      borderWidth: 3,
                    },
                  },
                ],
              },
            ],
          })
      : Option.makeBase();

  opt
    .setBackgroundAction({
      name: 'click',
      action: async (chart: echarts.ECharts) => {
        const option = chart.getOption();
        if (
          (option.series as any).every((s: any) =>
            ['treemap', 'sunburst'].includes(s.type)
          )
        )
          return;

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
        if (
          params.seriesType === 'treemap' &&
          (params as any).selfType === 'breadcrumb'
        ) {
          const trees = (chart.getOption() as any).series[params.seriesIndex]
            .data;
          const path = (params as any).treePathInfo;

          let i = 1;
          let node = { children: trees };
          let children = trees;
          while (i < path.length) {
            node = children.find(
              (n: { name: string; value: any }) =>
                n.name === path[i].name && n.value === path[i].value
            );
            children = node.children;
            i++;
          }

          next = [node];
        }

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
          await Option.filterOptionFromQuery(HOST, queryStrWithData)
        );
      },
    });

  return opt;
};
