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
      grid: {
        left: '8%',
        right: '5%',
        top: '18%',
        bottom: '20%',
        containLabel: false,
        show: false,
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
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
          },
          labelLayout: {
            hideOverlap: true,
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
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
      (this.option as any).series[seriesIndex].data = [treedata];
      this.option.dataset = [];
    }
  };
}
