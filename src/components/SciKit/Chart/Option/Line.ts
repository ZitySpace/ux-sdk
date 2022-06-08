import { Base } from './Base';

export class Line extends Base {
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
      dataZoom: {
        type: 'inside',
        orient: 'horizontal',
        filterMode: 'none',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        name: '',
        type: 'value',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
        },
      },
      yAxis: {
        name: '',
        type: 'value',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          fontWeight: 'bold',
        },
      },
      series: [
        {
          name: 'SeriesName',
          type: 'line',
          encode: {
            x: '',
            y: '',
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
}
