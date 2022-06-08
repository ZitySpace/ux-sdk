import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import {
  MouseEventParams,
  BrushSelectedEventParams,
  Base,
} from '../Option/Base';
import { useFilterFromDataframe } from '../../../../utils';

export const makeOption = (
  timeRange: string,
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) => {
  const opt =
    timeRange === 'yearly'
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
              max: 80,
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
      : new Base();

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
        console.log(params);
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
