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
      legend: {
        orient: 'vertical',
        left: '20%',
      },
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
  }
}
