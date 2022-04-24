import React, { useState, useRef, useEffect } from 'react';
import {
  PlayIcon,
  InformationCircleIcon,
  DocumentReportIcon,
} from '@heroicons/react/solid';

import {
  PagingStoreProvider,
  createPagingStore,
  usePagingStore,
} from '../../stores/pagingStore';
import PaginationBar from '../PaginationBar';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

type StateT<S> = [S, React.Dispatch<React.SetStateAction<S>>]; // not conflict with zustand State

function tryState<S>(state: StateT<S> | null, initialState: S) {
  return state ? state : useState<S>(initialState);
}

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
  atom = null,
}: {
  title?: string;
  initCode?: string;
  placeholder?: string;
  readOnly?: boolean;
  onCodeRun?: Function | null;
  atom?: StateT<CodeEditorResultProps> | null;
}) => {
  const code = useRef<string>(initCode);

  const [log, setLog] = useState<string>('');
  const [showLog, setShowLog] = useState<boolean>(true);
  const [showResult, setShowResult] = useState<boolean>(true);

  const [result, setResult] = tryState<CodeEditorResultProps>(atom, '');

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

type DataFrameProps = CodeEditorResultProps;

export const DataFrame = ({
  title = 'DataFrame',
  df = null,
  atom = null,
}: {
  title?: string;
  df?: DataFrameProps | null;
  atom?: StateT<DataFrameProps> | null;
}) => (
  <PagingStoreProvider createStore={createPagingStore}>
    <DataFrameCore title={title} df={df} atom={atom} />
  </PagingStoreProvider>
);

const DataFrameCore = ({
  title = 'DataFrame',
  df = null,
  atom = null,
}: {
  title?: string;
  df?: DataFrameProps | null;
  atom?: StateT<DataFrameProps> | null;
}) => {
  const [dataframe] = df ? [df] : tryState(atom, '');

  const [pos, step, setPos, setTotal] = usePagingStore((s) => [
    s.pos,
    s.step,
    s.setPos,
    s.setTotal,
  ]);

  const isMsg = typeof dataframe === 'string';
  useEffect(() => {
    if (!isMsg) {
      setPos(0);
      setTotal(dataframe.data.length);
      setSelected(Array(dataframe.data.length).fill(false));
    }
  }, [dataframe]);

  const [selected, setSelected] = useState<boolean[]>(
    Array(isMsg ? 0 : dataframe.data.length).fill(false)
  );

  return (
    <div className='bg-gray-100 h-full flex flex-col rounded-md shadow-lg'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
        <span>{title}</span>
      </div>
      <div className='resize-y overflow-auto h-48 bg-white '>
        {isMsg ? (
          <div className='flex justify-center text-xs'>{dataframe}</div>
        ) : (
          <>
            <table className='min-w-full divide-y divide-gray-200 relative table-fixed'>
              <thead className='bg-gray-700 sticky top-0'>
                <tr>
                  <th
                    scope='col'
                    className='px-3 py-2 text-left text-xs font-medium text-gray-200'
                    onClick={() => {
                      const allSelected = !selected
                        .slice(pos, pos + step)
                        .includes(false);
                      const newSelected = [...selected];
                      newSelected.splice(
                        pos,
                        step,
                        ...Array(step).fill(!allSelected)
                      );
                      setSelected(newSelected);
                    }}
                  >
                    <input
                      type='checkbox'
                      className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-white w-3.5 h-3.5'
                      checked={!selected.slice(pos, pos + step).includes(false)}
                      readOnly
                    />
                  </th>

                  {dataframe.header.map((name, icol) => (
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
                {dataframe.data.slice(pos, pos + step).map((row, irow) => (
                  <tr
                    key={irow}
                    className='bg-white border-b'
                    onClick={() => {
                      const newSelected = [...selected];
                      newSelected.splice(pos + irow, 1, !selected[pos + irow]);
                      setSelected(newSelected);
                    }}
                  >
                    <td className='px-3 py-2 whtiespace-nowrap'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-indigo-100 w-3.5 h-3.5'
                          checked={selected[pos + irow] || false}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ACECodeEditor;
