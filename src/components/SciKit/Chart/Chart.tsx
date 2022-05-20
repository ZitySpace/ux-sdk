import React, { useEffect, useRef, useReducer } from 'react';
import * as echarts from 'echarts';
import { useDataframeStore } from '../../../stores/dataframeStore';
import { useStore } from 'zustand';

interface ChartDatasetProps {
  header?: string[];
  data: any[][] | { [key: string]: any }[] | { [key: string]: any[] };
}

enum ChartExternalDatasetOpts {
  jsonUri,
  dataframeStoreName,
}

type ChartExternalDatasetProps = {
  [key in ChartExternalDatasetOpts]: string;
};

const fetchData = async (jsonUri: string) => {
  const response = await fetch(jsonUri, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export type ActionOptions =
  | 'click'
  | 'dblclick'
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'mouseover'
  | 'mouseout';

export type EventParams = {
  // The component name clicked,
  // component type, could be 'series'、'markLine'、'markPoint'、'timeLine', etc..
  componentType: string;
  // series type, could be 'line'、'bar'、'pie', etc.. Works when componentType is 'series'.
  seriesType: string;
  // the index in option.series. Works when componentType is 'series'.
  seriesIndex: number;
  // series name, works when componentType is 'series'.
  seriesName: string;
  // name of data (categories).
  name: string;
  // the index in 'data' array.
  dataIndex: number;
  // incoming raw data item
  data: Object;
  // charts like 'sankey' and 'graph' included nodeData and edgeData as the same time.
  // dataType can be 'node' or 'edge', indicates whether the current click is on node or edge.
  // most of charts have one kind of data, the dataType is meaningless
  dataType: string;
  // incoming data value
  value: any | Array<any>;
  // color of the shape, works when componentType is 'series'.
  color: string;
};

export type ElementActionsProps = {
  actionName: ActionOptions;
  elementQuery?: string | Object;
  action: (params: EventParams) => void;
}[];

export type ResetActionProps = {
  actionName: ActionOptions;
  action: () => void;
};

const Chart = ({
  title = 'Chart',
  dataset = null,
  option,
  elementActions = null,
  resetAction = null,
}: {
  title?: string;
  dataset?: ChartDatasetProps | ChartExternalDatasetProps | null;
  option: echarts.EChartsOption;
  elementActions: ElementActionsProps | null;
  resetAction: ResetActionProps | null;
}) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef<ChartDatasetProps | null>(null);
  const actionsBinded = useRef<boolean>(false);

  const dataframeStore = useDataframeStore(
    dataset && 'dataframeStoreName' in dataset
      ? dataset['dataframeStoreName']
      : 'dummyChartDFStore'
  );
  const storeData = useStore(dataframeStore, (s) => ({
    header: s.header,
    data: s.data,
  }));

  useEffect(() => {
    const chartInit = () => {
      chartRef.current =
        chartRef.current ||
        echarts.init(chartDivRef.current as HTMLElement, undefined, {
          renderer: 'svg',
        });
      forceUpdate();
    };

    const dataReset = async () => {
      if (dataset === null) dataRef.current = null;
      else if ('jsonUri' in dataset)
        dataRef.current = await fetchData(dataset['jsonUri']);
      else if ('dataframeStoreName' in dataset) dataRef.current = storeData;
      else dataRef.current = dataset as ChartDatasetProps;
      forceUpdate();
    };

    chartInit();
    dataReset();
  }, [dataset]);

  const chart = chartRef.current;
  const data = dataRef.current;
  const ready = chart && (dataset === null || data);

  if (ready) {
    chart.setOption(
      data === null
        ? option
        : {
            dataset:
              'header' in data
                ? {
                    dimensions: data['header'],
                    source: data['data'],
                  }
                : { dimensions: undefined, source: data['data'] },
            ...option,
          }
    );

    window.addEventListener('resize', () => chart.resize());

    if (!actionsBinded.current && elementActions)
      elementActions.map((a) =>
        a.elementQuery
          ? chart.on(a.actionName, a.elementQuery, (params) =>
              a.action(params as any)
            )
          : chart.on(a.actionName, (params) => a.action(params as any))
      );

    if (!actionsBinded.current && resetAction)
      chart.getZr().on(resetAction.actionName, function (event) {
        if (!event.target) {
          resetAction.action();
        }
      });

    actionsBinded.current = true;
  }

  return (
    <div className='bg-gray-100 h-full flex flex-col rounded-md shadow-lg'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
        <span>{title}</span>
      </div>
      <div className='h-full w-full' ref={chartDivRef}></div>
    </div>
  );
};

export default Chart;
