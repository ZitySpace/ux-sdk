import { Base, ChartExternalDatasetProps, fetchData, queryData } from './Base';

export interface ChartTreeDataProps {
  name: string;
  value?: any;
  children?: ChartTreeDataProps[];
}

interface ChartTreeDataGenFuncProps {
  (): ChartTreeDataProps | Promise<ChartTreeDataProps>;
}

export class Sunburst extends Base {
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
          type: 'sunburst',
          data: [],

          emphasis: {
            focus: 'descendant',
          },
        },
      ],
    };
    this.treeData = null;

    this.methods = { ...this.methods, setTreeData: this.setTreeDataRun };
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
      (this.option as any).series[seriesIndex].data = treedata.children;
      this.option.dataset = [];
    }
  };
}
