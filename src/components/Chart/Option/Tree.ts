import { Base, ChartExternalDatasetProps, fetchData, queryData } from './Base';

export interface ChartTreeDataProps {
  name: string;
  value?: any;
  children?: ChartTreeDataProps[];
}

interface ChartTreeDataGenFuncProps {
  (): ChartTreeDataProps | Promise<ChartTreeDataProps>;
}

export class Tree extends Base {
  treeData:
    | ChartTreeDataProps
    | ChartExternalDatasetProps
    | ChartTreeDataGenFuncProps
    | null;

  constructor() {
    super();
    this.option = {
      toolbox: {
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
        show: true,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      series: [
        {
          name: 'SeriesName',
          type: 'tree',
          data: [],

          symbolSize: 7,
          labelLayout: {
            hideOverlap: true,
          },
          emphasis: {
            focus: 'descendant',
          },
          expandAndCollapse: true,
          roam: true,
        },
      ],
    };
    this.treeData = null;

    this.methods = {
      ...this.methods,
      setTreeData: this.setTreeDataRun,
      setMultiTreeData: this.setMultiTreeDataRun,
    };
  }

  setTreeData = (
    data:
      | ChartTreeDataProps
      | ChartExternalDatasetProps
      | ChartTreeDataGenFuncProps
      | null,
    seriesIndex: number = 0
  ) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setTreeData', params: [data, seriesIndex] },
    ];
    return this;
  };

  protected setTreeDataRun = async (
    data:
      | ChartTreeDataProps
      | ChartExternalDatasetProps
      | ChartTreeDataGenFuncProps
      | null,
    seriesIndex: number = 0
  ) => {
    this.treeData = data;

    const treedata: ChartTreeDataProps | null =
      data === null
        ? null
        : typeof data === 'function'
        ? await data()
        : 'jsonUri' in data
        ? await fetchData(data['jsonUri'])
        : 'queryApi' in data
        ? await queryData(data['queryApi']['host'], data['queryApi']['query'])
        : data;

    if (treedata) {
      (this.option as any).series[seriesIndex].data = [treedata];
      this.option.dataset = [];
    }
  };

  setMultiTreeData = (
    data:
      | ChartTreeDataProps
      | ChartExternalDatasetProps
      | ChartTreeDataGenFuncProps
      | null,
    seriesIndices: number[] | null = null
  ) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setMultiTreeData', params: [data, seriesIndices] },
    ];
    return this;
  };

  protected setMultiTreeDataRun = async (
    data:
      | ChartTreeDataProps
      | ChartExternalDatasetProps
      | ChartTreeDataGenFuncProps
      | null,
    seriesIndices: number[] | null = null
  ) => {
    this.treeData = data;

    const treedata: ChartTreeDataProps | null =
      data === null
        ? null
        : typeof data === 'function'
        ? await data()
        : 'jsonUri' in data
        ? await fetchData(data['jsonUri'])
        : 'queryApi' in data
        ? await queryData(data['queryApi']['host'], data['queryApi']['query'])
        : data;

    if (treedata && treedata.children && treedata.children.length) {
      const thisOption = this.option as any;
      thisOption.dataset = [];

      const children = treedata.children;
      const indices = seriesIndices
        ? seriesIndices
        : Array.from({ length: children.length }, (_, i) => i);
      const nExpectedSeries = Math.max(...indices) + 1;

      const series = thisOption.series as any[];
      if (nExpectedSeries > series.length)
        thisOption.series = [
          ...series,
          ...Array.from(
            { length: nExpectedSeries - series.length },
            (_, i) => i
          ).map((i) => ({
            ...series[0],
          })),
        ];

      indices.map((i: number) => {
        thisOption.series[i].data = [children[i]];
        thisOption.series[i].name = children[i].name;
      });
    }
  };
}
