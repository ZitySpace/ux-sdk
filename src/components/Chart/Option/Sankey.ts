import { Base, ChartExternalDatasetProps } from './Base';
import { fetchData, queryData } from '../../../utils';

export interface ChartSankeyDataProps {
  nodes: {
    name: 'string';
    depth?: number;
    value?: number;
  }[];

  links: {
    source: 'string';
    target: 'string';
    value?: any;
  }[];
}

interface ChartSankeyDataGenFuncProps {
  (): ChartSankeyDataProps | Promise<ChartSankeyDataProps>;
}

export class Sankey extends Base {
  sankeyData:
    | ChartSankeyDataProps
    | ChartExternalDatasetProps
    | ChartSankeyDataGenFuncProps
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
          type: 'sankey',

          // IMPORTANT: each node must have unique node name
          nodes: [],
          links: [],

          orient: 'horizontal',
          nodeAlign: 'justify',

          emphasis: {
            focus: 'adjacency',
          },

          lineStyle: {
            color: 'gradient',
            curveness: 0.5,
          },
        },
      ],
    };
    this.sankeyData = null;

    this.methods = {
      ...this.methods,
      setSankeyData: this.setSankeyDataRun,
    };
  }

  setSankeyData = (
    data:
      | ChartSankeyDataProps
      | ChartExternalDatasetProps
      | ChartSankeyDataGenFuncProps
      | null,
    seriesIndex: number = 0
  ) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setSankeyData', params: [data, seriesIndex] },
    ];
    return this;
  };

  protected setSankeyDataRun = async (
    data:
      | ChartSankeyDataProps
      | ChartExternalDatasetProps
      | ChartSankeyDataGenFuncProps
      | null,
    seriesIndex: number = 0
  ) => {
    this.sankeyData = data;

    const sankeydata: ChartSankeyDataProps | null =
      data === null
        ? null
        : typeof data === 'function'
        ? await data()
        : 'jsonUri' in data
        ? await fetchData(data['jsonUri'])
        : 'queryApi' in data
        ? await queryData(data['queryApi']['host'], data['queryApi']['query'])
        : data;

    if (sankeydata) {
      (this.option as any).series[seriesIndex].nodes = sankeydata.nodes;
      (this.option as any).series[seriesIndex].links = sankeydata.links.map(
        (l) => ({
          value: 1,
          ...l,
        })
      );
      this.option.dataset = [];
    }
  };
}
