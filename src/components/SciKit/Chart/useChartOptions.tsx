import React, { useEffect, useState, useRef } from 'react';
import produce from 'immer';
import ScikitGroup from '../Scikit';
import Input from '../Input';
import { objectToString, stringToObject } from '../../../utils/misc';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

export const useBarChartOptions = ({
  idx = null,
  editable = false,
}: {
  idx?: number | string | null;
  editable?: boolean;
}) => {
  const optionInit = {
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

  const [option, setOption] = useState<object>(optionInit);
  const [code, setCode] = useState<string>(objectToString(optionInit));

  const prevIdxRef = useRef<number | string | null>();
  useEffect(() => {
    setOption(optionInit);
    setCode(objectToString(optionInit));
    prevIdxRef.current = idx;
  }, [idx]);

  const updateParams = (params: any) => {
    if (prevIdxRef.current !== idx) return; // code reset not completed yet

    const newOpt = produce(option, (opt: any) => {
      opt.series[0].encode = { x: params.xAxis, y: params.yAxis };
    });
    setOption(newOpt);
    setCode(objectToString(newOpt));
  };

  const paramsScikitRef =
    useRef<{ getValue: Function; getSetValue: Function }>();

  useEffect(() => {
    setCode(code);

    const newOpt = stringToObject(code);
    if (
      newOpt !== null &&
      typeof newOpt !== 'string' &&
      !(newOpt instanceof String)
    ) {
      setOption(newOpt);

      const params = paramsScikitRef.current?.getValue();
      const { x, y } = (newOpt as any).series[0].encode;
      const xAxisNew = x || '';
      const yAxisNew = y || '';
      const setValues = paramsScikitRef.current?.getSetValue();
      if (params['xAxis'] !== xAxisNew) setValues['xAxis'](xAxisNew);
      if (params['yAxis'] !== yAxisNew) setValues['yAxis'](yAxisNew);
    }
  }, [code]);

  if (!editable) return { option };

  const Editor = (
    <div className='grid grid-cols-4 gap-8'>
      <div
        className='overflow-auto'
        key={`bar${idx === null ? '-' + idx : ''}`}
      >
        <ScikitGroup
          hideTitle={true}
          hideFooter={true}
          flat={true}
          scroll={false}
          yesCallback={updateParams}
          reactive={true}
          ref={paramsScikitRef}
        >
          <Input name='xAxis' defaultValue='' />
          <Input name='yAxis' defaultValue='' />
        </ScikitGroup>
      </div>

      <div
        className='resize-y overflow-auto h-48 pt-1 col-span-3'
        style={{ backgroundColor: '#272822' }}
      >
        <AceEditor
          mode='typescript'
          theme='monokai'
          name='Option'
          fontSize={14}
          readOnly={false}
          value={code}
          placeholder='Write Apache Echarts option here'
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
          }}
          //   height='100%'
          maxLines={Infinity}
          width='100%'
          showPrintMargin={false}
          onChange={setCode}
        />
      </div>
    </div>
  );

  return {
    option,
    setOption: (opt: object) => setCode(objectToString(opt)),
    Editor,
  };
};

export const usePieChartOptions = ({
  idx = null,
  editable = false,
}: {
  idx?: number | string | null;
  editable?: boolean;
}) => {
  const optionInit = {
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
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
    },
    series: {
      name: 'SeriesName',
      type: 'pie',
      radius: 50,
      center: ['50%', '50%'],
      encode: {
        x: '',
        y: '',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  };

  const [option, setOption] = useState<object>(optionInit);
  const [code, setCode] = useState<string>(objectToString(optionInit));

  const prevIdxRef = useRef<number | string | null>();
  useEffect(() => {
    setOption(optionInit);
    setCode(objectToString(optionInit));
    prevIdxRef.current = idx;
  }, [idx]);

  const updateParams = (params: any) => {
    if (prevIdxRef.current !== idx) return; // code reset not completed yet

    const newOpt = produce(option, (opt: any) => {
      opt.series.encode = { x: params.name, y: params.value };
    });
    setOption(newOpt);
    setCode(objectToString(newOpt));
  };

  const updateCode = (code: string) => {
    const newOpt = stringToObject(code);
    if (
      newOpt !== null &&
      typeof newOpt !== 'string' &&
      !(newOpt instanceof String)
    )
      setOption(newOpt);

    setCode(code);
  };

  if (!editable) return { option };

  const Editor = (
    <div className='grid grid-cols-4 gap-8'>
      <div
        className='overflow-auto'
        key={`pie${idx === null ? '-' + idx : ''}`}
      >
        <ScikitGroup
          hideTitle={true}
          hideFooter={true}
          flat={true}
          scroll={false}
          yesCallback={updateParams}
          reactive={true}
        >
          <Input name='name' defaultValue='' />
          <Input name='value' defaultValue='' />
        </ScikitGroup>
      </div>

      <div
        className='resize-y overflow-auto h-48 pt-1 col-span-3'
        style={{ backgroundColor: '#272822' }}
      >
        <AceEditor
          mode='typescript'
          theme='monokai'
          name='Option'
          fontSize={14}
          readOnly={false}
          value={code}
          placeholder='Write Apache Echarts option here'
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: false,
          }}
          //   height='100%'
          maxLines={Infinity}
          width='100%'
          showPrintMargin={false}
          onChange={updateCode}
        />
      </div>
    </div>
  );

  return { option, setOption: updateCode, Editor };
};
