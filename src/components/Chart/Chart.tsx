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
  const firstRender = useRef<boolean>(true);

  useEffect(() => {
    const chartInit = () => {
      chartRef.current =
        chartRef.current ||
        echarts.init(chartDivRef.current as HTMLElement, undefined, {
          renderer: 'svg',
        });
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
    if (
      (option.size.height && option.size.height !== chart.getHeight()) ||
      (option.size.width && option.size.width !== chart.getWidth())
    )
      chart.resize(option.size);

    if (firstRender.current) {
      chart.setOption(option.option);
      window.addEventListener('resize', () => chart.resize());

      const elementActions = option.actions.element;
      if (elementActions)
        elementActions.map((a) =>
          a.query
            ? chart.on(a.name, a.query, (params) =>
                a.action(params as any, chart)
              )
            : chart.on(a.name, (params) => a.action(params as any, chart))
        );

      const backgroundAction = option.actions.background;
      if (backgroundAction)
        chart.getZr().on(backgroundAction.name, function (event) {
          if (!event.target) {
            backgroundAction.action(chart);
          }
        });

      firstRender.current = false;
    }
  }

  return (
    <div
      className={`us-bg-gray-100 us-h-full us-flex us-flex-col us-rounded-md ${
        flat ? '' : 'us-shadow-lg'
      }`}
    >
      {!hideTitle && (
        <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2 us-text-xs'>
          <span>{title}</span>
        </div>
      )}
      <div
        className='us-h-full us-w-full us-flex us-justify-center'
        ref={chartDivRef}
      ></div>
    </div>
  );
};

export default Chart;
