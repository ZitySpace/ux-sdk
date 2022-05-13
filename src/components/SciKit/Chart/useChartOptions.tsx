import React, { useState } from 'react';
import ScikitGroup from '../Scikit';
import Input from '../Input';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const objectToString = (obj: object) => {
  const str = JSON.stringify(obj, null, 2);

  return str
    .replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => match.replace(/"/g, ''))
    .replace(/"/g, "'");
};

const stringToObject = (str: string) => eval('(' + str + ')');

export const useBarChartOptions = (withEditor: boolean = false) => {
  const opt = {
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

  const [code, setCode] = useState<string>(objectToString(opt));

  if (!withEditor) return { opt };

  const Editor = (
    <div className='grid grid-cols-4 gap-8'>
      <div className='overflow-auto'>
        <ScikitGroup
          hideTitle={true}
          hideFooter={true}
          flat={true}
          scroll={false}
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
          name='Dataset'
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
          onChange={(curCode) => setCode(curCode)}
        />
      </div>
    </div>
  );

  return { opt, Editor };
};
