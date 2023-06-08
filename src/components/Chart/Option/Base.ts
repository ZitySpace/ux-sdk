import { filterAtomMap, requestTemplate } from '../../../atoms';
import * as echarts from 'echarts';
import merge from 'ts-deepmerge';

interface ChartDataProps {
  header?: string[];
  data: any[][] | { [key: string]: any }[] | { [key: string]: any[] };
  name?: string;
}

interface ChartDataGenFuncProps {
  ():
    | ChartDataProps
    | Promise<ChartDataProps>
    | ChartDataProps[]
    | Promise<ChartDataProps[]>;
}

export type ChartDatasetProps = {
  dimensions?: string[];
  source: any[][];
}[];

export type ChartExternalDatasetProps =
  | {
      jsonUri: string;
    }
  | {
      queryApi: {
        host: string;
        query: string;
      };
    };

interface GridParams {
  shape: number | number[];
  margin: number | number[];
  innerGaps: number | number[];
  sizes?: number | (number | number[])[];
}

interface GridParamsGenFuncProps {
  (dataset: ChartDatasetProps): GridParams;
}

interface ChartOptionProps {
  [key: string]: any | any[];
}

interface ChartOptionGenFuncProps {
  (dataset: ChartDatasetProps): ChartOptionProps;
}

export const queryData = async (host: string, query: string) => {
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

export const fetchData = async (jsonUri: string) => {
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
  'title',
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
  'calendar',
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
  if (params.dimensionNames && params.dimensionNames.length)
    return Object.fromEntries(
      params.dimensionNames.map((_, i) => [
        params.dimensionNames[i],
        params.value[i],
      ])
    );

  return params.value || '';
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
      brushType: string;
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
    | { (params: MouseEventParams): void }
    | { (params: BrushSelectedEventParams): void }
    | { (params: MouseEventParams, chart: echarts.ECharts): void }
    | { (params: BrushSelectedEventParams, chart: echarts.ECharts): void };
};

type BackgroundActionProps = {
  name: string;
  action: { (): void } | { (chart: echarts.ECharts): void };
};

export class Base {
  size: { width?: number; height?: number };
  data:
    | ChartDataProps
    | ChartDataProps[]
    | ChartExternalDatasetProps
    | ChartDataGenFuncProps
    | null;
  option: echarts.EChartsOption;
  actions: {
    element: ElementActionProps[] | null;
    background: BackgroundActionProps | null;
  };
  protected methods: { [name: string]: Function };
  protected callStack: { name: string; params: any[] }[];

  constructor() {
    this.size = {};
    this.data = null;
    this.option = {};
    this.actions = { element: null, background: null };
    this.methods = {
      setData: this.setDataRun,
      setBackgroundAction: this.setBackgroundActionRun,
      addElementAction: this.addElementActionRun,
      updateOption: this.updateOptionRun,
      makeGrid: this.makeGridRun,
    };
    this.callStack = [];
  }

  setSize = ({ width, height }: { width?: number; height?: number }) => {
    width && (this.size.width = width);
    height && (this.size.height = height);
    return this;
  };

  run = async () => {
    for (const { name, params } of this.callStack) {
      await this.methods[name](...params);
    }

    return this;
  };

  setData = (
    data:
      | ChartDataProps
      | ChartDataProps[]
      | ChartExternalDatasetProps
      | ChartDataGenFuncProps
      | null,
    dataNameCol: string | null = null
  ) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setData', params: [data, dataNameCol] },
    ];
    return this;
  };

  protected setDataRun = async (
    data:
      | ChartDataProps
      | ChartDataProps[]
      | ChartExternalDatasetProps
      | ChartDataGenFuncProps
      | null,
    dataNameCol: string | null
  ) => {
    this.data = data;

    const dataset: ChartDataProps | ChartDataProps[] | null =
      data === null
        ? null
        : typeof data === 'function'
        ? await data()
        : 'jsonUri' in data
        ? await fetchData(data['jsonUri'])
        : 'queryApi' in data
        ? await queryData(data['queryApi']['host'], data['queryApi']['query'])
        : data;

    if (dataset) {
      // convert dataset into standard format
      let dimensions: string[];
      let source: any[][];

      (Array.isArray(dataset) ? dataset : [dataset]).map(
        (slice: ChartDataProps, i: number) => {
          const dataContent = slice['data'];

          if ('header' in slice) {
            dimensions = slice['header']!;
            source = dataContent as any[][];
          } else {
            if (Array.isArray(dataContent)) {
              if (Array.isArray(dataContent[0])) {
                dimensions = (dataContent as any[][])[0];
                source = (dataContent as any[][]).slice(1);
              } else {
                dimensions = Object.keys(
                  (dataContent as { [key: string]: any }[])[0]
                );
                source = (dataContent as { [key: string]: any }[]).map((r) =>
                  Object.values(r)
                );
              }
            } else {
              dimensions = Object.keys(dataContent);
              source = transposeMatrix(Object.values(dataContent));
            }
          }

          if (dataNameCol && !dimensions.includes(dataNameCol)) {
            dimensions.push(dataNameCol);
            source.map((item: any[], i: number) => item.push(i));
          }

          const datasetSlice =
            'name' in slice
              ? { dimensions, source, name: slice.name }
              : { dimensions, source };
          if (!this.option.dataset) {
            this.option.dataset = [datasetSlice];
          } else {
            (this.option.dataset as echarts.DatasetComponentOption[]).push(
              datasetSlice
            );
          }
        }
      );
    }
  };

  makeGrid = (gridParams: GridParams | GridParamsGenFuncProps) => {
    this.callStack = [
      ...this.callStack,
      { name: 'makeGrid', params: [gridParams] },
    ];
    return this;
  };

  protected makeGridRun = (gridParams: GridParams | GridParamsGenFuncProps) => {
    const { shape, margin, innerGaps, sizes } = {
      sizes: 1,
      ...(typeof gridParams === 'function'
        ? gridParams(this.option.dataset as ChartDatasetProps)
        : gridParams),
    };

    const [nRows, nCols] = Array.isArray(shape) ? shape : [shape, shape];
    const [marginL, marginT, marginR, marginB] = Array.isArray(margin)
      ? margin.length === 2
        ? [...margin, ...margin]
        : margin
      : [margin, margin, margin, margin];

    const getPos = (
      iStart: number,
      iEnd: number,
      n: number,
      mStart: number = 0,
      mEnd: number = 0,
      gap: number = 0 // this is outer gap
    ) => {
      const delta = (100 - mStart - mEnd + gap) / n;
      return [mStart + iStart * delta, 100 - mStart - iEnd * delta + gap];
    };

    const spots: (number | string)[][] = Array.from({ length: nRows }, (_, i) =>
      Array.from({ length: nCols }, (_, j) => '-')
    );

    const availableSpots = Array.from({ length: nRows }, (_, i) =>
      Array.from({ length: nCols }, (_, j) => [i, j])
    ).flat();

    const isAvailable = (i: number, j: number, size: number | number[]) => {
      const [h, w] = Array.isArray(size) ? size : [size, size];
      if (i + h > nRows || j + w > nCols) return false;

      return spots
        .slice(i, i + h)
        .every((row) => row.slice(j, j + w).every((s) => s === '-'));
    };

    const firstAvailableSpotIdx = (size: number | number[]) =>
      availableSpots.findIndex((spot) => isAvailable(spot[0], spot[1], size));

    const occupySpot = (
      i: number,
      j: number,
      h: number,
      w: number,
      gridIdx: number
    ) => {
      Array.from({ length: h }, (_, i_) =>
        Array.from({ length: w }, (_, j_) => [i + i_, j + j_])
      )
        .flat()
        .map(([x, y]) => (spots[x][y] = gridIdx));
    };

    const grids: any[] = [];
    const titles: any[] = [];
    const assignments = (
      Array.isArray(sizes)
        ? sizes
        : Array.from(
            { length: Math.floor(nRows / sizes) * Math.floor(nCols / sizes) },
            (_, i) => sizes
          )
    ).map((size, i) => {
      const spotIdx = firstAvailableSpotIdx(size);
      let spot = null;
      if (spotIdx !== -1) {
        spot = availableSpots.splice(spotIdx, 1)[0];
        const [h, w] = Array.isArray(size) ? size : [size, size];

        occupySpot(spot[0], spot[1], h, w, i);

        const [left, right] = getPos(
          spot[1],
          spot[1] + w,
          nCols,
          marginL,
          marginR
        );
        const [top, bottom] = getPos(
          spot[0],
          spot[0] + h,
          nRows,
          marginT,
          marginB
        );

        const innerGap = Array.isArray(innerGaps) ? innerGaps[i] : innerGaps;
        grids.push({
          left: left + innerGap + '%',
          top: top + '%',
          right: right + '%',
          bottom:
            bottom +
            (innerGap * ((this.size.width ? this.size.width : 1) * h)) /
              (w * (this.size.height ? this.size.height : 1)) +
            '%',
        });
        titles.push({
          textAlign: 'center',
          left: (left + innerGap + 100 - right) / 2 + '%',
          top: top - 2.5 + '%',
        });
      } else {
        grids.push({});
        titles.push({});
      }

      return spot;
    });

    this.option.grid = grids;
    this.option.title = titles;
  };

  public static filterFromQuery = async (
    host: string,
    query: string,
    params?: MouseEventParams
  ) => {
    let query_: string = query;
    if (params !== undefined) {
      const data = transformParams(params);
      query_ = `global data\ndata = ${JSON.stringify(data)}\n${query}`;
    }
    const df = await queryData(host, query_);
    const { header, data } = df ? df : { header: [], data: [] };
    return {
      choice: 'byDataframeGroupByImage' as keyof typeof filterAtomMap,
      value: {
        header,
        data,
        selected: Array(data.length).fill(false),
      },
    };
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
    const areas = params.batch[0].areas.map((a) => ({
      brushType: a.brushType,
      coordRange: a.coordRange,
    }));
    const { dataset, series } = chart.getOption() as any;
    const selected = params.batch[0].selected
      .map((serie) => {
        const source =
          dataset[series[serie.seriesIndex].datasetIndex || 0].source;
        return serie.dataIndex.map((i) => source[i]);
      })
      .flat();

    return { areas, selected, dimensions: dataset[0].dimensions };
  };

  private columnExist = (
    nameOrIdx: string | number,
    datasetIndex: number = 0
  ) => {
    if (!this.option.dataset) return false;

    const dataset = (this.option.dataset as ChartDatasetProps)[datasetIndex];
    if (!dataset) return false;

    const ndim = dataset.dimensions!.length;

    if (typeof nameOrIdx === 'number' && nameOrIdx >= ndim) return false;
    if (
      typeof nameOrIdx === 'string' &&
      !dataset.dimensions?.includes(nameOrIdx)
    )
      return false;

    return true;
  };

  protected getColumn = (
    nameOrIdx: string | number,
    datasetIndex: number = 0
  ) => {
    if (!this.columnExist(nameOrIdx, datasetIndex)) return [];

    const dataset = (this.option.dataset as ChartDatasetProps)[datasetIndex];
    const index =
      typeof nameOrIdx === 'number'
        ? nameOrIdx
        : dataset.dimensions!.findIndex((name) => name === nameOrIdx);

    return dataset.source.map((d) => d[index]);
  };

  protected getColumns = (
    nameOrIdxArr: (string | number)[],
    datasetIndex: number = 0
  ) => {
    const columns = nameOrIdxArr.reduce(
      (res: any[][], nameOrIdx: string | number) => {
        const values = this.getColumn(nameOrIdx, datasetIndex);
        return values.length === 0
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

  protected groupByColumn = (by: string | number, datasetIndex: number = 0) => {
    if (!this.columnExist(by, datasetIndex)) return {};

    const dataset = (this.option.dataset as ChartDatasetProps)[datasetIndex];
    const source = dataset.source;

    const index =
      typeof by === 'number'
        ? by
        : dataset.dimensions!.findIndex((name) => name === by);
    const calcKey = (row: any[]) => row[index];

    return source.reduce(
      (res: { [key: string]: ChartDatasetProps[0] }, row: any[]) => {
        const key = calcKey(row);

        res[key] = res[key] || { dimensions: dataset.dimensions, source: [] };
        res[key].source.push(row);
        return res;
      },
      {}
    );
  };

  protected groupByColumns = (
    by: string[] | number[],
    datasetIndex: number = 0
  ) => {};

  protected groupByFunction = (by: Function, datasetIndex: number = 0) => {};

  protected groupBy = (
    by: string | number | string[] | number[] | Function,
    datasetIndex: number = 0
  ) => {
    if (typeof by === 'string' || typeof by === 'number')
      return this.groupByColumn(by, datasetIndex);

    return {};
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

  updateOption = (optionProps: ChartOptionProps | ChartOptionGenFuncProps) => {
    this.callStack = [
      ...this.callStack,
      { name: 'updateOption', params: [optionProps] },
    ];

    return this;
  };

  protected updateOptionRun = (
    optionProps: ChartOptionProps | ChartOptionGenFuncProps
  ) => {
    const option =
      typeof optionProps === 'function'
        ? optionProps(this.option.dataset as ChartDatasetProps)
        : optionProps;
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
