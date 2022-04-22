import React, { useState, useRef } from 'react';
import {
  PlayIcon,
  InformationCircleIcon,
  DocumentReportIcon,
  ViewGridIcon,
} from '@heroicons/react/solid';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const DataFrame = ({ header, data }: { header: string[]; data: any[][] }) => {};

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
  const [result, setResult] = useState<string>('');
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
            ? JSON.stringify(runResult.result, undefined, 4)
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
          value={result}
          placeholder='This displays the code run result'
          readOnly
        ></textarea>
      )}
      {showResultTable && <></>}
    </div>
  );
};

export default ACECodeEditor;
