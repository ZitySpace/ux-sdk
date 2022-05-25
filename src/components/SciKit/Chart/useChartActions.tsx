import React, { useState, useRef, useEffect } from 'react';
import ScikitGroup from '../Scikit';
import Select from '../Select';
import Input from '../Input';
import { EventParams, ActionOptions } from './Chart';
import { stringToObject } from '../../../utils/misc';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const defaultElementAction = (params: EventParams) =>
  console.log(
    Object.fromEntries(
      params.dimensionNames.map((_, i) => [
        params.dimensionNames[i],
        params.value[i],
      ])
    )
  );

const defaultBackgroundAction = () => console.log('reset: background clicked');

export const useChartActions = ({
  editable = false,
  queryCallback = (code: string) => console.log(code),
}: {
  editable?: boolean;
  queryCallback?: Function;
}) => {
  const [elementAction, setElementActionCore] = useState<{
    actionName: ActionOptions;
    elementQuery: string | Object;
  }>({
    actionName: 'click' as ActionOptions,
    elementQuery: 'series',
  });

  const setElementAction = (params: any) => {
    const elementQuery_ = stringToObject(params.elementQuery);

    setElementActionCore({
      actionName: params.actionName,
      elementQuery:
        elementQuery_ === null ? elementAction.elementQuery : elementQuery_,
    });
  };

  const [elementActionQuery, setElementActionQuery] = useState<{
    action: (params: EventParams) => void;
  }>({ action: defaultElementAction });
  const [elementActionQueryCode, setElementActionQueryCode] =
    useState<string>('');

  const parseParamsInCode = (params: EventParams, code: string) => {
    const data = Object.fromEntries(
      params.dimensionNames.map((_, i) => [
        params.dimensionNames[i],
        params.value[i],
      ])
    );

    return `data = ${JSON.stringify(data)}\n${code}`;
  };

  useEffect(() => {
    const newAction =
      elementActionQueryCode === ''
        ? defaultElementAction
        : async (params: EventParams) =>
            await queryCallback(
              parseParamsInCode(params, elementActionQueryCode)
            );

    setElementActionQuery({ action: newAction });
  }, [elementActionQueryCode]);

  const [backgroundAction, setBackgroundActionCore] = useState<{
    actionName: ActionOptions;
  }>({
    actionName: 'click' as ActionOptions,
  });

  const setBackgroundAction = (params: any) => {
    setBackgroundActionCore({ actionName: params.actionName });
  };

  const [backgroundActionQuery, setBackgroundActionQuery] = useState<{
    action: () => void;
  }>({ action: defaultBackgroundAction });
  const [backgroundActionQueryCode, setBackgroundActionQueryCode] =
    useState<string>('');

  useEffect(() => {
    const newAction =
      backgroundActionQueryCode === ''
        ? defaultBackgroundAction
        : async () => await queryCallback(backgroundActionQueryCode);

    setBackgroundActionQuery({ action: newAction });
  }, [backgroundActionQueryCode]);

  const elementActionScikitRef = useRef<{ getSetValue: Function }>();
  const backgroundActionScikitRef = useRef<{ getSetValue: Function }>();

  const setElementActionByScikit = (params: { [key: string]: any }) => {
    const setValues = elementActionScikitRef.current?.getSetValue();
    Object.keys(params).map((k) => setValues[k](params[k]));
  };

  const setBackgroundActionByScikit = (params: { [key: string]: any }) => {
    const setValues = backgroundActionScikitRef.current?.getSetValue();
    Object.keys(params).map((k) => setValues[k](params[k]));
  };

  const Editor = (
    <>
      <div>
        <div className='relative flex items-center w-full px-8'>
          <div className='flex-grow border-t border-indigo-200'></div>
          <span className='flex-shrink mx-4 text-indigo-400 text-xs font-semibold'>
            @element
          </span>
          <div className='flex-grow border-t border-indigo-200'></div>
        </div>
        <div className='flex justify-start'>
          <ScikitGroup
            hideTitle={true}
            hideFooter={true}
            flat={true}
            scroll={false}
            yesCallback={setElementAction}
            reactive={true}
            ref={elementActionScikitRef}
          >
            <Select
              name='actionName'
              options={[
                'click',
                'dblclick',
                'mousedown',
                'mousemove',
                'mouseup',
                'mouseover',
                'mouseout',
              ]}
              defaultValue='click'
            />
            <Input name='elementQuery' defaultValue='series' />
          </ScikitGroup>
        </div>

        <div className='flex items-start justify-start -translate-y-1'>
          <div className='w-28 mr-3 relative h-7 flex-none'>
            <label className='block absolute right-0 text-right text-sm font-medium text-gray-700'>
              actionQuery
            </label>
          </div>
          <div
            className='resize-y overflow-auto h-12 pt-1 grow'
            style={{ backgroundColor: '#272822' }}
          >
            <AceEditor
              mode='typescript'
              theme='monokai'
              name='Option'
              fontSize={14}
              readOnly={false}
              value={elementActionQueryCode}
              placeholder='Write pandas DataFrame query for element action'
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
              onChange={setElementActionQueryCode}
            />
          </div>
        </div>
      </div>

      <div>
        <div className='relative flex items-center w-full px-8'>
          <div className='flex-grow border-t border-indigo-200'></div>
          <span className='flex-shrink mx-4 text-indigo-400 text-xs font-semibold'>
            @background
          </span>
          <div className='flex-grow border-t border-indigo-200'></div>
        </div>
        <div className='flex justify-start'>
          <ScikitGroup
            hideTitle={true}
            hideFooter={true}
            flat={true}
            scroll={false}
            yesCallback={setBackgroundAction}
            reactive={true}
            ref={backgroundActionScikitRef}
          >
            <Select
              name='actionName'
              options={['click']}
              defaultValue='click'
            />
          </ScikitGroup>
        </div>

        <div className='flex items-start justify-start -translate-y-1'>
          <div className='w-28 mr-3 relative h-7 flex-none'>
            <label className='block absolute right-0 text-right text-sm font-medium text-gray-700'>
              actionQuery
            </label>
          </div>
          <div
            className='resize-y overflow-auto h-12 pt-1 grow'
            style={{ backgroundColor: '#272822' }}
          >
            <AceEditor
              mode='typescript'
              theme='monokai'
              name='Option'
              fontSize={14}
              readOnly={false}
              value={backgroundActionQueryCode}
              placeholder='Write pandas DataFrame query for background query'
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
              onChange={setBackgroundActionQueryCode}
            />
          </div>
        </div>
      </div>
    </>
  );

  return {
    actions: {
      elementActions: [{ ...elementAction, ...elementActionQuery }],
      resetAction: { ...backgroundAction, ...backgroundActionQuery },
    },
    setElementAction: setElementActionByScikit,
    setElementActionQuery: setElementActionQueryCode,
    setBackgroundAction: setBackgroundActionByScikit,
    setBackgroundActionQuery: setBackgroundActionQueryCode,
    Editor,
  };
};
