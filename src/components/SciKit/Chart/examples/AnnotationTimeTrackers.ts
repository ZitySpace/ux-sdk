import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams } from '../Option/Base';

export const makeOption = (
  timeRangeSerieType: string,
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) => {
  const opt =
    timeRangeSerieType === 'yearlyCalendar'
      ? Option.makeHeatmap()
          .setData({
            queryApi: {
              host: HOST,
              query:
                "res = df.groupby(df.last_updated.apply(lambda dt: dt[:10])).size().to_frame('count')",
            },
          })
          .updateOption({
            title: {
              left: 'center',
              text: 'Annotation Yearly Tracker',
            },
            visualMap: {
              dimension: 'count',
              min: 0,
              max: 100,
              orient: 'horizontal',
              left: 'center',
              bottom: 20,
            },
            xAxis: {
              show: false,
            },
            yAxis: {
              show: false,
            },
            calendar: {
              orient: 'horizontal',
              left: 60,
              right: 30,
              range: 2022,
              itemStyle: {
                borderWidth: 0.25,
              },
            },
            series: [
              {
                name: 'CountOfAnnotations',
                coordinateSystem: 'calendar',
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.5)',
                  },
                },
                selectedMode: 'single',
                encode: {
                  itemName: 'last_updated',
                  value: 'count',
                },
                tooltip: {
                  formatter: (params: MouseEventParams) =>
                    `${params.value[0]}, ${params.value[1]}`,
                },
              },
            ],
          })
      : timeRangeSerieType === 'monthlyCalendar'
      ? Option.makeBase()
          .setData({
            queryApi: {
              host: HOST,
              query:
                "res = df.groupby(df.last_updated.apply(lambda dt: dt[:10])).size().to_frame('count')",
            },
          })
          .updateOption({
            title: {
              left: 'center',
              text: 'Annotation Monthly Tracker',
            },
            visualMap: {
              dimension: 'count',
              min: 0,
              max: 100,
              right: '20%',
              top: 90,
              seriesIndex: [1],
            },
            xAxis: {
              show: false,
            },
            yAxis: {
              show: false,
            },
            tooltip: {
              formatter: (params: MouseEventParams) =>
                `${params.value[0]}, ${params.value[1]}`,
            },
            calendar: {
              orient: 'vertical',
              left: '30%',
              right: '30%',
              range: '2022-03',
              top: 90,
              height: 180,
              monthLabel: {
                margin: 15,
                fontSize: 16,
                color: '#999',
              },
              yearLabel: {
                margin: 40,
              },
              itemStyle: {
                borderWidth: 0.25,
              },
            },
            series: [
              {
                name: 'CountOfAnnotations',
                type: 'scatter',
                coordinateSystem: 'calendar',
                symbolSize: 1,
                label: {
                  show: true,
                  formatter: (params: MouseEventParams) => params.value[1],
                  color: '#000',
                },
                emphasis: {
                  disabled: true,
                },
                encode: {
                  itemName: 'last_updated',
                  value: 'count',
                },
              },
              {
                name: 'CountOfAnnotations',
                type: 'heatmap',
                coordinateSystem: 'calendar',
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.5)',
                  },
                },
                selectedMode: 'single',
                encode: {
                  itemName: 'last_updated',
                  value: 'count',
                },
              },
            ],
          })
      : timeRangeSerieType === 'timeLine'
      ? Option.makeLine()
          .setData({
            queryApi: {
              host: HOST,
              query:
                "res = df.groupby(df.last_updated.apply(lambda dt: dt[:10])).size().to_frame('count')",
            },
          })
          .updateOption({
            title: {
              left: 'center',
              text: 'Annotation Tracker',
            },
            xAxis: {
              name: 'Time',
              type: 'time',
            },
            yAxis: {
              name: 'Count',
            },
            series: [
              {
                name: 'CountOfAnnotations',
                encode: {
                  x: 'last_updated',
                  y: 'count',
                },
                smooth: true,
                symbolSize: 10,
                areaStyle: {
                  opacity: 0.3,
                },

                selectedMode: 'single',
                select: {
                  itemStyle: {
                    color: 'red',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 0,
                  },
                },
                emphasis: {
                  scale: 2,
                  itemStyle: {
                    color: 'red',
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 0,
                  },
                },
                tooltip: {
                  formatter: (params: MouseEventParams) =>
                    `${params.value[0]}, ${params.value[1]}`,
                },
              },
            ],
          })
      : Option.makeBase();

  opt
    .setBackgroundAction({
      name: 'click',
      action: async (chart: echarts.ECharts) => {
        Option.unselectAll(chart);
        setFiltering(await Option.filterOptionFromQuery(HOST, 'res = df'));
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams) => {
        setFiltering(
          await Option.filterOptionFromQuery(
            HOST,
            "res = df[df.last_updated.apply(lambda dt: dt.startswith(data['last_updated']))]",
            params
          )
        );
      },
    });

  return opt;
};
