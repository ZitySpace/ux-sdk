import { Base } from './Base';

const paletteDefault = [
  // vega category10 color scheme
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',

  // vega category20 color scheme
  // '#1f77b4',
  // '#aec7e8',
  // '#ff7f0e',
  // '#ffbb78',
  // '#2ca02c',
  // '#98df8a',
  // '#d62728',
  // '#ff9896',
  // '#9467bd',
  // '#c5b0d5',
  // '#8c564b',
  // '#c49c94',
  // '#e377c2',
  // '#f7b6d2',
  // '#7f7f7f',
  // '#c7c7c7',
  // '#bcbd22',
  // '#dbdb8d',
  // '#17becf',
  // '#9edae5',
];

export class Scatter extends Base {
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
      animation: true,
      dataZoom: [
        {
          type: 'inside',
          filterMode: 'empty',
        },
        { type: 'inside', orient: 'vertical', filterMode: 'empty' },
      ],
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        name: '',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
        },
        type: 'value',
      },
      yAxis: {
        name: '',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
        },
        type: 'value',
      },
      series: [
        {
          name: 'SeriesName',
          type: 'scatter',
          symbolSize: 15,
          encode: {
            x: '',
            y: '',
          },
          // tooltip: {
          //   formatter: (params: any) => {
          //     return `${params.seriesName}: (${
          //       params.value[params.encode.x[0]]
          //     }, ${params.value[params.encode.y[0]]})`;
          //   },
          // },
        },
      ],
    };

    this.methods = {
      ...this.methods,
      setX: this.setXRun,
      setY: this.setYRun,
      setColor: this.setColorRun,
    };
  }

  setX = (dimName: string, seriesIndex: number = 0) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setX', params: [dimName, seriesIndex] },
    ];

    return this;
  };

  protected setXRun = (dimName: string, seriesIndex: number = 0) =>
    ((this.option as any).series[seriesIndex].encode.x = dimName);

  setY = (dimName: string, seriesIndex: number = 0) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setY', params: [dimName, seriesIndex] },
    ];

    return this;
  };

  protected setYRun = (dimName: string, seriesIndex: number = 0) =>
    ((this.option as any).series[seriesIndex].encode.y = dimName);

  setColor = (
    dimName: string,
    seriesIndex: number = 0,
    palette: string[] = paletteDefault
  ) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setColor', params: [dimName, seriesIndex, palette] },
    ];

    return this;
  };

  protected setColorRun = (
    dimName: string,
    seriesIndex: number = 0,
    palette: string[] = paletteDefault
  ) => {
    const thisOption = this.option as any;

    const values = this.getColumn(dimName);
    if (!values.length) return;
    const uniqValues = Array.from(new Set(values));
    const colors = Array.from(
      { length: Math.ceil(uniqValues.length / palette.length) },
      () => palette
    ).flat();

    // as of v5.3.2, unlike legend, visualMap does not
    // support wrapping/paging/scrollable.
    // simulate paging by creating multiple visualMaps
    // https://github.com/apache/echarts/issues/13759
    // https://github.com/apache/echarts/issues/8413
    // unfortunately, this still doesn't work, because
    // all three visual maps will apply on the same data
    // and only the last visualmap will take effect. points/categories
    // outOfRange for the last visualmap will be invisible. Sucks.
    const nPerMap = 12;
    thisOption.visualMap = Array.from(
      { length: Math.ceil(uniqValues.length / nPerMap) },
      (_, i) => ({
        type: 'piecewise',
        itemSymbol: 'circle',
        seriesIndex: seriesIndex,
        dimension: dimName,
        top: 'top',
        left: i * 160,
        categories: uniqValues.slice(i * nPerMap, (i + 1) * nPerMap),
        inRange: {
          color: colors.slice(i * nPerMap, (i + 1) * nPerMap),
        },
      })
    );
  };
}
