import { Base } from './Base';

export class Pie extends Base {
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
      grid: {},
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {},
      series: [
        {
          name: 'SeriesName',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          encode: {
            itemName: '',
            value: '',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    this.methods = { ...this.methods, setX: this.setXRun, setY: this.setYRun };
  }

  setX = (dimName: string, seriesIndex: number = 0) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setX', params: [dimName, seriesIndex] },
    ];

    return this;
  };

  protected setXRun = (dimName: string, seriesIndex: number = 0) =>
    ((this.option as any).series[seriesIndex].encode.itemName = dimName);

  setY = (dimName: string, seriesIndex: number = 0) => {
    this.callStack = [
      ...this.callStack,
      { name: 'setY', params: [dimName, seriesIndex] },
    ];

    return this;
  };

  protected setYRun = (dimName: string, seriesIndex: number = 0) =>
    ((this.option as any).series[seriesIndex].encode.value = dimName);
}
