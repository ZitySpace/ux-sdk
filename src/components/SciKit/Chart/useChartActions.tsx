import React, { useState } from 'react';
import ScikitGroup from '../Scikit';
import { EventParams } from './Chart';

enum ActionTarget {
  Element = 'element',
  Background = 'background',
}

export const useChartActions = () => {
  const actions = {
    elementActions: [
      {
        actionName: 'click',
        elementQuery: 'series',
        action: (params: EventParams) => console.log(params.data),
      },
    ],
    resetAction: {
      actionName: 'click',
      action: () => console.log('reset: background clicked'),
    },
  };

  const [actionTarget, setActionTarget] = useState<ActionTarget>(
    ActionTarget.Element
  );

  const Editor = (
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
  );

  return { actions, Editor };
};
