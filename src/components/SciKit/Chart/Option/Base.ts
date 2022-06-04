import { requestTemplate } from '../../../../utils/apis';
import { useFilterFromDataframe } from '../../../../utils';
import * as echarts from 'echarts';
import merge from 'ts-deepmerge';

interface ChartDataProps {
  header?: string[];
  data: any[][] | { [key: string]: any }[] | { [key: string]: any[] };
}

interface ChartDatasetProps {
  dimensions?: string[];
  source: any[][] | { [key: string]: any }[] | { [key: string]: any[] };
}

type ChartExternalDatasetProps =
  | {
      jsonUri: string;
    }
  | {
      queryApi: {
        host: string;
        query: string;
      };
    };

const queryData = async (host: string, query: string) => {
  const api = requestTemplate(
    (code: string) => {
      return {
        url: host,
        method: 'POST',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          code: code,
        }),
      };
    },
    ...[,],
    ...[,],
    false
  );

  try {
    const r = await api(query);
    if (r && r.hasOwnProperty('result') && typeof r.result !== 'string')
      return r.result;
    return null;
  } catch (err) {
    return null;
  }
};

const fetchData = async (jsonUri: string) => {
  const response = await fetch(jsonUri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

const ListableOptions = [
  'grid',
  'xAxis',
  'yAxis',
  'polar',
  'radiusAxis',
  'angleAxis',
  'radar',
  'dataZoom',
  'visualMap',
  'dataset',
  'series',
];

const splitListableOption = (option: echarts.EChartsOption | object) => {
  return [
    Object.fromEntries(
      Object.entries(option).filter(([key]) => ListableOptions.includes(key))
    ),
    Object.fromEntries(
      Object.entries(option).filter(([key]) => !ListableOptions.includes(key))
    ),
  ];
};

const transposeMatrix = (matrix: any[][]) =>
  matrix[0].map((_, c) => matrix.map((row, r) => matrix[r][c]));

const transformParams = (params: MouseEventParams) => {
  if (params.dimensionNames.length)
    return Object.fromEntries(
      params.dimensionNames.map((_, i) => [
        params.dimensionNames[i],
        params.value[i],
      ])
    );

  return params.value;
};

export type MouseEventParams = {
  // The component name clicked,
  // component type, could be 'series'、'markLine'、'markPoint'、'timeLine', etc..
  componentType: string;
  // series type, could be 'line'、'bar'、'pie', etc.. Works when componentType is 'series'.
  seriesType: string;
  // the index in option.series. Works when componentType is 'series'.
  seriesIndex: number;
  // series name, works when componentType is 'series'.
  seriesName: string;
  // name of data (categories).
  name: string;
  // the index in 'data' array.
  dataIndex: number;
  // incoming raw data item
  data: Object;
  // charts like 'sankey' and 'graph' included nodeData and edgeData as the same time.
  // dataType can be 'node' or 'edge', indicates whether the current click is on node or edge.
  // most of charts have one kind of data, the dataType is meaningless
  dataType: string;
  // incoming data value
  value: any | Array<any>;
  // color of the shape, works when componentType is 'series'.
  color: string;
  // dimension names
  dimensionNames: string[];
};

export type BrushSelectedEventParams = {
  type: 'brushselected';
  batch: {
    brushId: string;
    brushIndex: number;
    brushName: string;

    areas: {
      range: number[];
      coordRange: number[];
      coordRanges: number[][];
    }[];

    selected: {
      seriesIndex: number;
      dataIndex: number[];
    }[];
  }[];
};

type ElementActionProps = {
  name: string;
  query?: string | Object;
  action:
    | { (params: MouseEventParams, chart?: echarts.ECharts): void }
    | { (params: BrushSelectedEventParams, chart?: echarts.ECharts): void };
};

type BackgroundActionProps = {
  name: string;
  action: (chart?: echarts.ECharts) => void;
};

export class Base {
  data: ChartDataProps | ChartExternalDatasetProps | null;
  option: echarts.EChartsOption;
  actions: {
    element: ElementActionProps[] | null;
    background: BackgroundActionProps | null;
  };
  protected methods: { [name: string]: Function };
  protected callStack: { name: string; params: any[] }[];

  constructor() {
    this.data = null;
    this.option = {};
    this.actions = { element: null, background: null };
    this.methods = {
      setData: this.setDataRun,
      setBackgroundAction: this.setBackgroundActionRun,
      addElementAction: this.addElementActionRun,
      updateOption: this.updateOptionRun,
    };
    this.callStack = [];
  }

  run = async () => {
    for (const { name, params } of this.callStack) {
      await this.methods[name](...params);
    }

    return this;
  };

  setData = (data: ChartDataProps | ChartExternalDatasetProps | null) => {
    this.callStack = [...this.callStack, { name: 'setData', params: [data] }];
    return this;
  };

  protected setDataRun = async (
    data: ChartDataProps | ChartExternalDatasetProps | null
  ) => {
    this.data = data;

    const dataset: ChartDataProps | null =
      data === null
        ? null
        : 'jsonUri' in data
        ? await fetchData(data['jsonUri'])
        : 'queryApi' in data
        ? await queryData(data['queryApi']['host'], data['queryApi']['query'])
        : data;

    if (dataset)
      this.option = {
        dataset:
          'header' in dataset
            ? [{ dimensions: dataset['header'], source: dataset['data'] }]
            : [{ source: dataset['data'] }],
        ...this.option,
      };
  };

  public static filterOptionFromQuery = async (
    host: string,
    query: string,
    params?: MouseEventParams
  ) => {
    let query_: string = query;
    if (params !== undefined) {
      const data = transformParams(params);
      query_ = `data = ${JSON.stringify(data)}\n${query}`;
    }
    const df = await queryData(host, query_);
    const { header, data } = df ? df : { header: [], data: [] };
    const filterOption = useFilterFromDataframe({ header, data }, true);
    return filterOption;
  };

  public static unselectAll = (chart: echarts.ECharts) => {
    chart.dispatchAction({
      type: 'unselect',
      seriesIndex: Array.from({ length: 100 }, (_, i) => i),
      dataIndex: Array.from({ length: 10000 }, (_, i) => i),
    });
  };

  public static getBrushedItems = (
    params: BrushSelectedEventParams,
    chart: echarts.ECharts
  ) => {
    const { dataset, series } = chart.getOption();
    console.log(params);
  };

  protected getColumn = (
    nameOrIdx: string | number,
    datasetIndex: number = 0
  ) => {
    if (!this.option.dataset) return [];

    const dataset = (this.option.dataset as ChartDatasetProps[])[datasetIndex];
    if (!dataset) return [];

    const source = dataset.source;

    if (dataset.hasOwnProperty('dimensions')) {
      const ndim = dataset.dimensions!.length;

      if (typeof nameOrIdx === 'number' && nameOrIdx >= ndim) return [];
      if (
        typeof nameOrIdx === 'string' &&
        !dataset.dimensions?.includes(nameOrIdx)
      )
        return [];

      const index =
        typeof nameOrIdx === 'number'
          ? nameOrIdx
          : dataset.dimensions?.findIndex((name) => name === nameOrIdx)!;
      return (source as any[][]).map((d) => d[index]);
    }

    if (Array.isArray(source)) {
      const first = source[0];
      if (Array.isArray(first)) {
        const ndim = first.length;

        if (typeof nameOrIdx === 'number' && nameOrIdx >= ndim) return [];
        if (typeof nameOrIdx === 'string' && !first.includes(nameOrIdx))
          return [];

        const index =
          typeof nameOrIdx === 'number'
            ? nameOrIdx
            : first.findIndex((name) => name === nameOrIdx)!;
        return (source as any[][]).slice(1).map((d) => d[index]);
      }

      const names = Object.keys(first);
      if (typeof nameOrIdx === 'number' && nameOrIdx >= names.length) return [];
      if (typeof nameOrIdx === 'string' && !names.includes(nameOrIdx))
        return [];

      const name = typeof nameOrIdx === 'string' ? nameOrIdx : names[nameOrIdx];
      return (source as { [key: string]: any }[]).map((d) => d[name]);
    }

    const names = Object.keys(source);
    if (typeof nameOrIdx === 'number' && nameOrIdx >= names.length) return [];
    if (typeof nameOrIdx === 'string' && !names.includes(nameOrIdx)) return [];

    const name = typeof nameOrIdx === 'string' ? nameOrIdx : names[nameOrIdx];

    return source[name];
  };

  protected getColumns = (
    nameOrIdxArr: (string | number)[],
    datasetIndex: number = 0
  ) => {
    const columns = nameOrIdxArr.reduce(
      (res: any[][], nameOrIdx: string | number) => {
        const values = this.getColumn(nameOrIdx, datasetIndex);
        return values === []
          ? res
          : [
              [...res[0], values],
              [...res[1], nameOrIdx],
            ];
      },
      [[], []]
    );

    return columns[1].length
      ? [transposeMatrix(columns[0]), columns[1]]
      : [[], []];
  };

  setBackgroundAction = (action: BackgroundActionProps) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setBackgroundAction', params: [action] },
    ];

    return this;
  };

  protected setBackgroundActionRun = (action: BackgroundActionProps) =>
    (this.actions.background = action);

  addElementAction = (action: ElementActionProps) => {
    this.callStack = [
      ...this.callStack,
      { name: 'addElementAction', params: [action] },
    ];

    return this;
  };

  protected addElementActionRun = (action: ElementActionProps) => {
    if (this.actions.element === null) this.actions.element = [action];
    else this.actions.element = [...this.actions.element, action];
  };

  updateOption = (option: object) => {
    this.callStack = [
      ...this.callStack,
      { name: 'updateOption', params: [option] },
    ];

    return this;
  };

  protected updateOptionRun = (option: {
    [key: string]: object | object[];
  }) => {
    const thisOption = this.option;

    const mergeListableOpts = (
      optL_: object | object[],
      optR_: object | object[]
    ) => {
      const optL = Array.isArray(optL_) ? optL_ : [optL_];
      const optR = Array.isArray(optR_) ? optR_ : [optR_];

      const merged =
        optL.length >= optR.length
          ? optL.map((s: object, i: number) =>
              i >= optR.length
                ? s
                : merge.withOptions({ mergeArrays: false }, s, optR[i])
            )
          : optR.map((s: object, i: number) =>
              i >= optL.length
                ? s
                : merge.withOptions({ mergeArrays: false }, optL[i], s)
            );

      return merged;
    };

    const [listableThisOpts, nonListableThisOpts] =
      splitListableOption(thisOption);
    const [listableOpts, nonListableOpts] = splitListableOption(option);
    const nonListableMergedOpts = merge.withOptions(
      { mergeArrays: false },
      nonListableThisOpts,
      nonListableOpts
    );
    const listableKeys = Array.from(
      new Set([...Object.keys(listableThisOpts), ...Object.keys(listableOpts)])
    );
    const listableMergedOpts = Object.fromEntries(
      listableKeys.map((k: string) => [
        k,
        mergeListableOpts(
          thisOption.hasOwnProperty(k)
            ? (thisOption[k] as object | object[])
            : [],
          option[k] || []
        ),
      ])
    );

    this.option = { ...nonListableMergedOpts, ...listableMergedOpts };
  };
}
