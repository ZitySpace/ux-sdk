import { Base } from './Base';

export class Bar extends Base {
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
        orient: 'vertical',
        filterMode: 'none',
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'SeriesName',
          type: 'bar',
          showBackground: false,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
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
