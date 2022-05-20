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

enum ActionTarget {
  Element = 'element',
  Background = 'background',
}

const defaultElementAction = (params: EventParams) => console.log(params.data);
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

  const [actionTarget, setActionTarget] = useState<ActionTarget>(
    ActionTarget.Element
  );

  const setElementActions = (params: any) => {
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
    console.log(params, code);
    return code;
  };

  const updateElementActionQuery = (code: string) => {
    setElementActionQuery(code);

    const newAction =
      code === ''
        ? defaultElementAction
        : (params: EventParams) =>
            queryCallback(parseParamsInCode(params, code));

    setActions({
      ...actions,
      elementActions: [{ ...actions.elementActions[0], action: newAction }],
    });
  };

  const updateBackgroundActionQuery = (code: string) => {
    setBackgroundActionQuery(code);

    const newAction =
      code === '' ? defaultBackgroundAction : () => queryCallback(code);

    setActions({
      ...actions,
      resetAction: {
        ...actions.resetAction,
        action: newAction,
      },
    });
  };

  const Editor = (
    <div>
      <div className='flex jusity-start space-x-4'>
        <button
          type='button'
          className={`w-20 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          actionTarget === 'element'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
          onClick={() => {
            setActionTarget(ActionTarget.Element);
          }}
        >
          @element
        </button>
        <button
          type='button'
          className={`w-28 inline-flex justify-center items-center px-3.5 py-2 border
                        text-xs font-semibold rounded-lg shadow-sm
                        hover:border-indigo-600 hover:ring-1 hover:ring-indigo-600
                        ${
                          actionTarget === 'background'
                            ? 'text-gray-50 bg-indigo-600 outline-none'
                            : 'text-gray-600 bg-transparent border-gray-400'
                        }`}
          onClick={() => {
            setActionTarget(ActionTarget.Background);
          }}
        >
          @background
        </button>
      </div>
      <div className='pt-2'>
        <div className='flex justify-start'>
          {actionTarget === ActionTarget.Element ? (
            <ScikitGroup
              hideTitle={true}
              hideFooter={true}
              flat={true}
              scroll={false}
              yesCallback={setElementActions}
              reactive={true}
              key={0}
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
          ) : (
            <ScikitGroup
              hideTitle={true}
              hideFooter={true}
              flat={true}
              scroll={false}
              yesCallback={setBackgroundAction}
              reactive={true}
              key={1}
            >
              <Select
                name='actionName'
                options={['click']}
                defaultValue='click'
              />
            </ScikitGroup>
          )}
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
              value={
                actionTarget === ActionTarget.Element
                  ? elementActionQuery
                  : backgroundActionQuery
              }
              placeholder='Write pandas DataFrame query here'
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
              onChange={
                actionTarget === ActionTarget.Element
                  ? updateElementActionQuery
                  : updateBackgroundActionQuery
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return { actions, Editor };
};
