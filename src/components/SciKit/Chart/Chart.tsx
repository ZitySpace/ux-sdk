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

const Chart = ({
  title = 'Chart',
  dataset = null,
  option,
}: {
  title?: string;
  dataset?: ChartDatasetProps | ChartExternalDatasetProps | null;
  option: echarts.EChartsOption;
}) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const dataRef = useRef<ChartDatasetProps | null>(null);

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
