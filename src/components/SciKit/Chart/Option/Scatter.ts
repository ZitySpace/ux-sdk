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
          brush: { type: [] },
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
      legend: {},
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

    const serieOption = thisOption.series[seriesIndex];
    if (!serieOption) return;
    const datasetIndex = serieOption.datasetIndex || 0;

    const groups = this.groupBy(dimName, datasetIndex);
    const keys = Object.keys(groups);
    if (!keys.length) return;

    const colors = Array.from(
      { length: Math.ceil(keys.length / palette.length) },
      () => palette
    )
      .flat()
      .slice(0, keys.length);

    const start = thisOption.dataset.length;

    thisOption.dataset = [...thisOption.dataset, ...Object.values(groups)];

    thisOption.series = [
      ...thisOption.series,
      ...keys.map((k, i) => ({
        ...serieOption,
        name: k,
        datasetIndex: start + i,
        itemStyle: {
          ...serieOption.itemStyle,
          color: colors[i],
        },
      })),
    ];

    serieOption.data = [];
    thisOption.legend = {
      ...thisOption.legend,
      data: keys,
    };
  };
}
