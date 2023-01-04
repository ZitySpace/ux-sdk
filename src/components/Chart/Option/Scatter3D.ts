import { Base } from './Base';
import { paletteDefault } from './Scatter';
import * as echarts from 'echarts/core';

import { Scatter3DChart } from 'echarts-gl/charts';
import { Grid3DComponent } from 'echarts-gl/components';
import { EChartsOption } from 'echarts';

echarts.use([Scatter3DChart, Grid3DComponent]);

export class Scatter3D extends Base {
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

      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross',
        },
      },

      grid3D: {
        axisLine: {
          lineStyle: {
            color: '#fff',
          },
        },
        axisPointer: {
          lineStyle: {
            color: '#ffbd67',
          },
        },
        viewControl: {
          autoRotate: true,
          projection: 'perspective',
        },
      },

      xAxis3D: {
        name: '',
        type: 'value',
      },

      yAxis3D: {
        name: '',
        type: 'value',
      },

      zAxis3D: {
        name: '',
        type: 'value',
      },

      series: [
        {
          name: 'SeriesName',
          type: 'scatter3D',
          encode: {
            x: '',
            y: '',
            z: '',
          },
        },
      ],
    } as EChartsOption;

    this.methods = {
      ...this.methods,
      setColor: this.setColorRun,
    };
  }

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
