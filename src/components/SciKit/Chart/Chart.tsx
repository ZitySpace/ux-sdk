import React, { useEffect, useRef, useReducer } from 'react';
import * as echarts from 'echarts';
import { Option } from './Option';

const Chart = ({
  title = 'Chart',
  option,
  hideTitle = false,
  flat = false,
}: {
  title?: string;
  option: Option;
  hideTitle?: boolean;
  flat?: boolean;
}) => {
  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;
  const chartRef = useRef<echarts.EChartsType | null>(null);
  const chartDivRef = useRef<HTMLDivElement | null>(null);
  const actionsBinded = useRef<boolean>(false);

  useEffect(() => {
    const chartInit = () => {
      chartRef.current =
        chartRef.current ||
        echarts.init(chartDivRef.current as HTMLElement, undefined, {
          renderer: 'svg',
        });
      forceUpdate();
    };

    const optionInit = async () => {
      await option.run();
      forceUpdate();
    };

    chartInit();
    optionInit();
  }, [option]);

  const chart = chartRef.current;
  const ready = chart && option.option.dataset;

  if (ready) {
    chart.setOption(option.option);

    window.addEventListener('resize', () => chart.resize());

    const elementActions = option.actions.element;
    if (!actionsBinded.current && elementActions)
      elementActions.map((a) =>
        a.query
          ? chart.on(a.name, a.query, (params) =>
              a.action(params as any, chart)
            )
          : chart.on(a.name, (params) => a.action(params as any, chart))
      );

    const backgroundAction = option.actions.background;
    if (!actionsBinded.current && backgroundAction)
      chart.getZr().on(backgroundAction.name, function (event) {
        if (!event.target) {
          backgroundAction.action(chart);
        }
      });

    actionsBinded.current = true;

    if (
      (option.size.height && option.size.height !== chart.getHeight()) ||
      (option.size.width && option.size.width !== chart.getWidth())
    )
      chart.resize(option.size);
  }

  return (
    <div
      className={`bg-gray-100 h-full flex flex-col rounded-md ${
        flat ? '' : 'shadow-lg'
      }`}
    >
      {!hideTitle && (
        <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
          <span>{title}</span>
        </div>
      )}
      <div className='h-full w-full' ref={chartDivRef}></div>
    </div>
  );
};

export default Chart;
