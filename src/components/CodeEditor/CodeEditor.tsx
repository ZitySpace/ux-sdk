import React, { useState, useRef } from 'react';
import {
  PlayIcon,
  InformationCircleIcon,
  DocumentReportIcon,
} from '@heroicons/react/solid';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

export type CodeEditorResultProps =
  | {
      header: string[];
      data: any[][];
    }
  | string;

const ACECodeEditor = ({
  title = 'Code Editor',
  initCode = '',
  placeholder = '',
  readOnly = false,
  onCodeRun = null,
  onSuccessCallback = null,
}: {
  title?: string;
  initCode?: string;
  placeholder?: string;
  readOnly?: boolean;
  onCodeRun?: Function | null;
  onSuccessCallback?: Function | null;
}) => {
  const code = useRef<string>(initCode);

  const [log, setLog] = useState<string>('');
  const [showLog, setShowLog] = useState<boolean>(true);
  const [showResult, setShowResult] = useState<boolean>(true);

  const [result, setResult] = useState<CodeEditorResultProps>('');

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

        const pass = runResult && runResult.hasOwnProperty('result');
        setResult(pass ? runResult.result : 'no result returned');

        if (pass && onSuccessCallback)
          await onSuccessCallback(
            typeof runResult.result === 'string' ? null : runResult.result
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
                  showResult ? 'text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => {
                  setShowResult(!showResult);
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
      {showResult && (
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
    </div>
  );
};

export default ACECodeEditor;
