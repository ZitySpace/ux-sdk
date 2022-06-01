import { requestTemplate } from '../../../../utils/apis';
import { useFilterFromDataframe } from '../../../../utils';
import * as echarts from 'echarts';
import merge from 'ts-deepmerge';

interface ChartDatasetProps {
  header?: string[];
  data: any[][] | { [key: string]: any }[] | { [key: string]: any[] };
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

const splitSeriesOption = (option: echarts.EChartsOption | object) => {
  if (!option.hasOwnProperty('series')) return [option, []];

  return [
    Object.fromEntries(
      Object.entries(option).filter(([key]) => key !== 'series')
    ),
    (option as any)['series'],
  ];
};

const transformParams = (params: EventParams) => {
  if (params.dimensionNames.length)
    return Object.fromEntries(
      params.dimensionNames.map((_, i) => [
        params.dimensionNames[i],
        params.value[i],
      ])
    );

  return params.value;
};

export type EventParams = {
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

type ElementActionProps = {
  name: string;
  query?: string | Object;
  action: (params: EventParams, chart?: echarts.ECharts) => void;
};

type BackgroundActionProps = {
  name: string;
  action: (chart?: echarts.ECharts) => void;
};

export class Base {
  data: ChartDatasetProps | ChartExternalDatasetProps | null;
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
    await Promise.all(
      this.callStack.map(async ({ name, params }) => {
        await this.methods[name](...params);
      })
    );

    return this;
  };

  setData = (data: ChartDatasetProps | ChartExternalDatasetProps | null) => {
    this.callStack = [...this.callStack, { name: 'setData', params: [data] }];
    return this;
  };

  protected setDataRun = async (
    data: ChartDatasetProps | ChartExternalDatasetProps | null
  ) => {
    this.data = data;

    const dataset: ChartDatasetProps | null =
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
            ? { dimensions: dataset['header'], source: dataset['data'] }
            : { source: dataset['data'] },
        ...this.option,
      };
  };

  public static filterOptionFromQuery = async (
    host: string,
    query: string,
    params?: EventParams
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
    const selected = (chart.getOption().series as any).reduce(
      (res: any, s: any) =>
        s.selectedMap
          ? [
              ...res,
              ...Object.keys(s.selectedMap).filter((k) => s.selectedMap[k]),
            ]
          : res,
      []
    );
    chart.dispatchAction({
      type: 'unselect',
      name: selected,
    });
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

  protected updateOptionRun = (option: object) => {
    if (!option.hasOwnProperty('series')) {
      this.option = merge.withOptions(
        { mergeArrays: false },
        this.option,
        option
      );
    } else {
      const [nonSeriesThis, seriesThis] = splitSeriesOption(this.option);
      const [nonSeries, series] = splitSeriesOption(option);

      const nonSeriesMerged = merge.withOptions(
        { mergeArrays: false },
        nonSeriesThis,
        nonSeries
      );
      const seriesMerged =
        series.length > seriesThis.length
          ? series.map((s: object, i: number) =>
              i >= seriesThis.length
                ? s
                : merge.withOptions({ mergeArrays: false }, seriesThis[i], s)
            )
          : seriesThis.map((s: object, i: number) =>
              i >= series.length
                ? s
                : merge.withOptions({ mergeArrays: false }, s, series[i])
            );

      this.option = { ...nonSeriesMerged, series: seriesMerged };
    }
  };
}
