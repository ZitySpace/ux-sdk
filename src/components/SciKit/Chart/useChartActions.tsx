import React, { useState } from 'react';
import ScikitGroup from '../Scikit';
import Select from '../Select';
import Input from '../Input';
import {
  ElementActionsProps,
  ResetActionProps,
  EventParams,
  ActionOptions,
} from './Chart';

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
  const actionsInit = {
    elementActions: [
      {
        actionName: 'click' as ActionOptions,
        elementQuery: 'series',
        action: defaultElementAction,
      },
    ],
    resetAction: {
      actionName: 'click' as ActionOptions,
      action: defaultBackgroundAction,
    },
  };

  const [actions, setActions] = useState<{
    elementActions: ElementActionsProps;
    resetAction: ResetActionProps;
  }>(actionsInit);

  const setElementAction = (params: any) => {
    setActions({
      ...actions,
      elementActions: [{ ...params, action: actions.elementActions[0].action }],
    });
  };

  const setBackgroundAction = (params: any) => {
    setActions({
      ...actions,
      resetAction: { ...params, action: actions.resetAction.action },
    });
  };

  const [elementActionQuery, setElementActionQuery] = useState<string>('');
  const [backgroundActionQuery, setBackgroundActionQuery] =
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

  const updateElementActionQuery = (code: string) => {
    setElementActionQuery(code);

    const newAction =
      code === ''
        ? defaultElementAction
        : async (params: EventParams) =>
            await queryCallback(parseParamsInCode(params, code));

    setActions({
      ...actions,
      elementActions: [{ ...actions.elementActions[0], action: newAction }],
    });
  };

  const updateBackgroundActionQuery = (code: string) => {
    setBackgroundActionQuery(code);

    const newAction =
      code === ''
        ? defaultBackgroundAction
        : async () => await queryCallback(code);

    setActions({
      ...actions,
      resetAction: {
        ...actions.resetAction,
        action: newAction,
      },
    });
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
              value={elementActionQuery}
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
              onChange={updateElementActionQuery}
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
              value={backgroundActionQuery}
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
              onChange={updateBackgroundActionQuery}
            />
          </div>
        </div>
      </div>
    </>
  );

  return {
    actions,
    setElementAction,
    setElementActionQuery,
    setBackgroundAction,
    setBackgroundActionQuery,
    Editor,
  };
};
