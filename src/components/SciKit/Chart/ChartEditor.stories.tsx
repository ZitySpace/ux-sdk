import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import Chart, { EventParams } from './Chart';
import { useBarChartOptions, usePieChartOptions } from './useChartOptions';
import { useChartActions } from './useChartActions';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import ace from 'ace-builds';
ace.config.set(
  'basePath',
  'https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-noconflict/'
);

export default {
  title: 'UX-SDK/ChartEditor',
  component: Chart,
} as ComponentMeta<typeof Chart>;

const ChartEditor = () => {
  const [datasetOptSelect, setDatasetOptSelect] = useState<string>('raw');

  const datasetCodeDefault = {
    raw: `{
  "header": ["Day", "Value"],
  "data": [
    ["Mon", 120],
    ["Tue", 200],
    ["Wed", 150],
    ["Thu", 80],
    ["Fri", 70],
    ["Sat", 110],
    ["Sun", 130]
  ]
}`,
    query: `res = df.groupby('category').size().to_frame('count')`,
    dataframeStore: `dataframeStoreName`,
  };

  const [datasetCode, setDatasetCode] = useState<string>(
    datasetCodeDefault[datasetOptSelect]
  );

  const [typeOptSelect, setTypeOptSelect] = useState<string>('bar');

  const { option: chartOption, Editor: ChartOptionEditor } =
    typeOptSelect === 'bar'
      ? useBarChartOptions({ idx: 0, editable: true })
      : typeOptSelect === 'pie'
      ? usePieChartOptions({ idx: 1, editable: true })
      : useBarChartOptions({ editable: true });

  const { actions: chartActions, Editor: ChartActionEditor } = useChartActions({
    editable: true,
  });

  return (
    <div className='bg-gray-100 h-full flex flex-col text-xs rounded-md shadow-lg select-none'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
        <span>Chart Editor</span>
      </div>

      <div className='py-4 px-8 space-y-4 divide-y divide-gray-200'>
        <div className='flex flex-col space-y-2'>
          <h3 className='text-lg '>Chart Dataset</h3>
          <div className='flex jusity-start space-x-4'>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          datasetOptSelect === 'raw'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setDatasetOptSelect('raw');
                setDatasetCode(datasetCodeDefault['raw']);
              }}
            >
              Raw
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          datasetOptSelect === 'query'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setDatasetOptSelect('query');
                setDatasetCode(datasetCodeDefault['query']);
              }}
            >
              Query
            </button>
            <button
              type='button'
              disabled
              className={`w-30 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm cursor-not-allowed
                        ${
                          datasetOptSelect === 'dataframeStore'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setDatasetOptSelect('dataframeStore');
                setDatasetCode(datasetCodeDefault['dataframeStore']);
              }}
            >
              DataframeStore
            </button>
          </div>
          <div
            className='resize-y overflow-auto h-48 pt-1'
            style={{ backgroundColor: '#272822' }}
          >
            <AceEditor
              mode={
                datasetOptSelect === 'raw'
                  ? 'json'
                  : datasetOptSelect === 'query'
                  ? 'python'
                  : 'text'
              }
              theme='monokai'
              name='Dataset'
              fontSize={14}
              readOnly={false}
              value={datasetCode}
              placeholder={
                datasetOptSelect === 'raw'
                  ? 'Write raw dataset here, format: { header: string[], data: any[][]}'
                  : datasetOptSelect === 'query'
                  ? 'Write pandas DataFrame query here'
                  : 'Write dataframeStoreName here'
              }
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
              onChange={(curCode) => setDatasetCode(curCode)}
            />
          </div>
        </div>
        <div className='pt-4 flex flex-col space-y-2'>
          <h3 className='text-lg '>Chart Type</h3>
          <div className='flex jusity-start space-x-4'>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'bar'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('bar');
              }}
            >
              Bar
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'scatter'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('scatter');
              }}
            >
              Scatter
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'line'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('line');
              }}
            >
              Line
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'pie'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('pie');
              }}
            >
              Pie
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'calendar'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('calendar');
              }}
            >
              Calendar
            </button>
            <button
              type='button'
              className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          typeOptSelect === 'heatmap'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
              onClick={() => {
                setTypeOptSelect('heatmap');
              }}
            >
              Heatmap
            </button>
          </div>
          {ChartOptionEditor}
        </div>
        <div className='pt-4 flex flex-col space-y-2'>
          <h3 className='text-lg '>Chart Action</h3>
          {ChartActionEditor}
        </div>
      </div>
    </div>
  );
};

const Template: ComponentStory<any> = (args) => {
  return <ChartEditor />;
};

export const Story = Template.bind({});
Story.args = {};
