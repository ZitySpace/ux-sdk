import React, { useState, useRef } from 'react';
import {
  PlayIcon,
  InformationCircleIcon,
  DocumentReportIcon,
  ViewGridIcon,
} from '@heroicons/react/solid';

import {
  PagingStoreProvider,
  createPagingStore,
} from '../../stores/pagingStore';
import PaginationBar from '../PaginationBar';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const DataFrame = ({ header, data }: { header: string[]; data: any[][] }) => {
  return (
    <PagingStoreProvider createStore={createPagingStore}>
      <div className='resize-y overflow-auto h-48 mt-1 bg-white'>
        <table className='min-w-full divide-y divide-gray-200 relative table-fixed'>
          <thead className='bg-gray-700 sticky top-0'>
            <tr>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-200'
                // onClick={}
              >
                <input
                  type='checkbox'
                  className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-white w-3.5 h-3.5'
                  // checked={}
                  readOnly
                />
              </th>

              {header.map((name, icol) => (
                <th
                  scope='col'
                  key={icol}
                  className='px-3 py-2 text-left text-xs font-medium text-gray-200'
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, irow) => (
              <tr key={irow} className='bg-white border-b'>
                <td className='px-3 py-2 whtiespace-nowrap'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-indigo-100 w-3.5 h-3.5'
                      // checked={}
                      readOnly
                    />
                  </div>
                </td>

                {row.map((cell, icol) => (
                  <td
                    key={icol}
                    className='px-3 py-2 whitespace-nowrap text-xs font-light text-gray-500 overflow-x-auto'
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='sticky bottom-0 min-w-full'>
          <PaginationBar />
        </div>
      </div>
    </PagingStoreProvider>
  );
};

const ACECodeEditor = ({
  title = 'Code Editor',
  initCode = '',
  placeholder = '',
  readOnly = false,
  onCodeRun = null,
}: {
  title?: string;
  initCode?: string;
  placeholder?: string;
  readOnly?: boolean;
  onCodeRun?: Function | null;
}) => {
  const code = useRef<string>(initCode);

  const [log, setLog] = useState<string>('');
  const [result, setResult] = useState<
    { header: string[]; data: any[][] } | string
  >('');
  const [showLog, setShowLog] = useState<boolean>(true);
  const [showResultPlain, setShowResultPlain] = useState<boolean>(true);
  const [showResultTable, setShowResultTable] = useState<boolean>(false);

  let onRun: Function;
  if (onCodeRun === null) onRun = () => {};
  else
    onRun = async () => {
      try {
        const runResult = await onCodeRun(code.current);
        setLog(
          runResult && runResult.hasOwnProperty('log')
            ? runResult.log
            : 'no log returned'
        );
        setResult(
          runResult && runResult.hasOwnProperty('result')
            ? runResult.result
            : 'no result returned'
        );
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : (err as string);
        setLog('Exception: ' + errMsg);
        setResult('');
      }
    };

  return (
    <div className='bg-gray-100 h-full flex flex-col rounded-md shadow-lg'>
      <div className='bg-indigo-400 py-1 px-2 rounded-t-md inline-grid grid-cols-3'>
        <div className='flex justify-start items-center pl-4'>
          {onCodeRun && (
            <>
              <PlayIcon
                className='h-8 w-8 hover:text-emerald-700'
                aria-hidden='true'
                onClick={() => onRun()}
              />
              <InformationCircleIcon
                className={`h-8 w-8 hover:text-emerald-700 ${
                  showLog ? 'text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => setShowLog(!showLog)}
              />
              <DocumentReportIcon
                className={`h-8 w-8 hover:text-emerald-700 ${
                  showResultPlain ? 'text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => {
                  setShowResultPlain(!showResultPlain);
                  setShowResultTable(false);
                }}
              />
              <ViewGridIcon
                className={`h-8 w-8 hover:text-emerald-700 ${
                  showResultTable ? 'text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => {
                  setShowResultTable(!showResultTable);
                  setShowResultPlain(false);
                }}
              />
            </>
          )}
        </div>
        <span className='flex justify-center items-center text-sm select-none'>
          {title}
        </span>
        <div></div>
      </div>
      <div
        className='resize-y overflow-auto h-48 pt-1'
        style={{ backgroundColor: '#272822' }}
      >
        <AceEditor
          mode='python'
          theme='monokai'
          name='Lambda'
          fontSize={14}
          readOnly={readOnly}
          value={code.current}
          placeholder={placeholder}
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
          onChange={(curCode) => (code.current = curCode)}
        />
      </div>

      {showLog && (
        <textarea
          className='resize-y overflow-auto h-48 mt-1 bg-gray-700 text-gray-200 text-xs px-4 pt-1 focus:outline-none'
          value={log}
          placeholder='This displays the code run logs'
          readOnly
        ></textarea>
      )}
      {showResultPlain && (
        <textarea
          className='resize-y overflow-auto h-48 mt-1 bg-gray-700 text-gray-200 text-xs px-4 pt-1 focus:outline-none'
          value={
            typeof result === 'string'
              ? result
              : JSON.stringify(result, undefined, 4)
          }
          placeholder='This displays the code run result'
          readOnly
        ></textarea>
      )}
      {showResultTable && typeof result !== 'string' && (
        <DataFrame header={result.header} data={result.data} />
      )}
    </div>
  );
};

export default ACECodeEditor;
