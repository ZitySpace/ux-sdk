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
  hideTitle = false,
  flat = true,
  rounded = false,
}: {
  title?: string;
  initCode?: string;
  placeholder?: string;
  readOnly?: boolean;
  onCodeRun?: Function | null;
  onSuccessCallback?: Function | null;
  hideTitle?: boolean;
  flat?: boolean;
  rounded?: boolean;
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
    <div
      className={`us-bg-gray-100 us-h-full us-flex us-flex-col
    ${flat ? '' : 'us-shadow-lg'} ${rounded ? 'us-rounded-md' : ''}
    `}
    >
      <div className='us-bg-indigo-400 us-py-1 us-px-2 us-rounded-t-md us-inline-grid us-grid-cols-3'>
        <div className='us-flex us-justify-start us-items-center us-pl-4'>
          {onCodeRun && (
            <>
              <PlayIcon
                className='us-h-8 us-w-8 hover:us-text-emerald-700'
                aria-hidden='true'
                onClick={() => onRun()}
              />
              <InformationCircleIcon
                className={`us-h-8 us-w-8 hover:us-text-emerald-700 ${
                  showLog ? 'us-text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => setShowLog(!showLog)}
              />
              <DocumentReportIcon
                className={`us-h-8 us-w-8 hover:us-text-emerald-700 ${
                  showResult ? 'us-text-emerald-700' : ''
                }`}
                aria-hidden='true'
                onClick={() => {
                  setShowResult(!showResult);
                }}
              />
            </>
          )}
        </div>
        <span className='us-flex us-justify-center us-items-center us-text-sm us-select-none'>
          {hideTitle ? '' : title}
        </span>
        <div></div>
      </div>
      <div
        className='us-resize-y us-overflow-auto us-h-48 us-pt-1'
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
          onChange={(curCode: string) => (code.current = curCode)}
        />
      </div>

      {showLog && (
        <textarea
          className='us-resize-y us-overflow-auto us-h-48 us-mt-1 us-bg-gray-700 us-text-gray-200 us-text-xs us-px-4 us-pt-1 focus:us-outline-none'
          value={log}
          placeholder='This displays the code run logs'
          readOnly
        ></textarea>
      )}
      {showResult && (
        <textarea
          className='us-resize-y us-overflow-auto us-h-48 us-mt-1 us-bg-gray-700 us-text-gray-200 us-text-xs us-px-4 us-pt-1 focus:us-outline-none'
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
