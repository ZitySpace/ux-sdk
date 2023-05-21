import { FilterProps } from '@/stores';
import { Option, MouseEventParams, ChartDatasetProps } from '@/components';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void },
  multi: boolean
) => {
  const opt = multi
    ? Option.makeHeatmap()
        .setSize({ height: 960, width: 960 })
        .setData(
          {
            queryApi: {
              host: HOST + '/confusion_matrix?taxonomy=attribute',
              query: '',
            },
          },
          'cellId'
        )
        .makeGrid((dataset: ChartDatasetProps) => {
          const toSize = (s: number) => Math.ceil(s / 6);
          const sizes = dataset.map((d) => toSize(Math.sqrt(d.source.length)));
          return {
            shape: [6, 6],
            margin: [0, 5, 5, 0],
            innerGaps: 9,
            sizes,
          };
        })
        .updateOption((dataset: ChartDatasetProps) => ({
          animation: false,
          title: dataset.map((d: any, i: number) => ({
            text: d.name,
            textStyle: {
              color: '#888',
              fontSize: 10,
              fontWeight: 'bold',
            },
          })),
          visualMap: dataset.map((d: any, i: number) => {
            const idxOfCount = d.dimensions.findIndex(
              (col: string) => col === 'count'
            );
            const max = Math.max(
              ...d.source.map((row: any[]) => row[idxOfCount])
            );

            return {
              type: 'continuous',
              seriesIndex: i,
              dimension: 'count',
              min: 0,
              max,
              inRange: {
                color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
              },

              show: false,
            };
          }),
          xAxis: dataset.map((d: any, i: number) => ({
            gridIndex: i,
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              rotate: 90,
              fontSize: 10,
              fontWeight: 'normal',
              interval: 0,
              width: 60,
              overflow: 'truncate',
            },
            splitLine: {
              show: false,
              interval: 0,
            },
          })),
          yAxis: dataset.map((d: any, i: number) => ({
            gridIndex: i,
            type: 'category',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 10,
              fontWeight: 'normal',
              interval: 0,
              width: 60,
              overflow: 'truncate',
            },
            splitLine: {
              show: false,
              interval: 0,
            },
          })),
          series: dataset.map((d: any, i: number) => ({
            datasetIndex: i,
            xAxisIndex: i,
            yAxisIndex: i,
            name: d.name,
            type: 'heatmap',
            encode: {
              x: 'pred',
              y: 'gt',
              itemName: 'cellId',
            },
            label: {
              show: true,
              fontSize: 8,
            },
            tooltip: {
              formatter: (params: MouseEventParams) =>
                `&nbsp;&thinsp;&thinsp;gt: ${params.value[0]} <br/>
                   &thinsp;&thinsp;pred: ${params.value[1]} <br/>
                   count: ${params.value[2]}`,
              textStyle: {
                fontSize: 10,
                fontFamily: 'monospace',
              },
            },
            selectedMode: 'single',
            select: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.5)',
                borderWidth: 0,
                color: 'green',
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.5)',
              },
            },
          })),
        }))
    : Option.makeHeatmap()
        .setSize({ height: 640, width: 640 })
        .setData(
          {
            queryApi: {
              host: HOST + '/confusion_matrix?taxonomy=category',
              query: '',
            },
          },
          'cellId'
        )
        .updateOption({
          title: {
            text: 'category',
            left: '53%',
            textStyle: {
              color: '#888',
              fontSize: 10,
              fontWeight: 'bold',
            },
            top: 20,
          },

          grid: {
            top: 40,
            left: 120,
            right: 0,
            bottom: 120,
          },

          animation: false,
          dataZoom: [
            {
              type: 'inside',
            },
            { type: 'inside', orient: 'vertical' },
          ],

          visualMap: {
            type: 'continuous',
            dimension: 'count',
            min: 0,
            max: 180,
            inRange: {
              color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
            },

            show: false,
          },

          xAxis: {
            type: 'category',
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              rotate: 90,
              fontSize: 10,
              fontWeight: 'normal',
              interval: 0,
            },
            splitLine: {
              show: false,
              interval: 0,
            },
          },
          yAxis: {
            type: 'category',
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              fontSize: 10,
              fontWeight: 'normal',
              interval: 0,
            },
            splitLine: {
              show: false,
              interval: 0,
            },
          },

          series: [
            {
              name: 'category',
              encode: {
                x: 'pred',
                y: 'gt',
                itemName: 'cellId',
              },
              label: {
                show: true,
                fontSize: 8,
              },
              tooltip: {
                formatter: (params: MouseEventParams) =>
                  `&nbsp;&thinsp;&thinsp;gt: ${params.value[0]} <br/>
                   &thinsp;&thinsp;pred: ${params.value[1]} <br/>
                   count: ${params.value[2]}`,
                textStyle: {
                  fontSize: 10,
                  fontFamily: 'monospace',
                },
              },
              selectedMode: 'single',
              select: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0,0,0,0.5)',
                  borderWidth: 0,
                  color: 'green',
                },
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0,0,0,0.5)',
                },
              },
            },
          ],
        });

  opt
    .setBackgroundAction({
      name: 'click',
      action: async (chart: echarts.ECharts) => {
        Option.unselectAll(chart);
        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]"
          )
        );
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams, chart: echarts.ECharts) => {
        Option.unselectAll(chart);

        chart.dispatchAction({
          type: 'select',
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        });

        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df.iloc[data['idx']][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]",
            params
          )
        );
      },
    });

  return opt;
};
