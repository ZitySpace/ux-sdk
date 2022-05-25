import { useState } from 'react';

type StateT<S> = [S, React.Dispatch<React.SetStateAction<S>>]; // not conflict with zustand State

export function tryState<S>(state: StateT<S> | null, initialState: S) {
  return state ? state : useState<S>(initialState);
}

export const objectToString = (obj: object) => {
  const str = JSON.stringify(obj, null, 2);

  return str
    .replace(/^[\t ]*"[^:\n\r]+(?<!\\)":/gm, (match) => match.replace(/"/g, ''))
    .replace(/"/g, "'");
};

export const stringToObject = (str: string) => {
  let obj: object | string | null = str;

  if (
    str.startsWith('{') ||
    str.endsWith('}') ||
    str.startsWith('[') ||
    str.endsWith(']')
  )
    try {
      obj = eval('(' + str + ')');
    } catch (error) {
      console.log('SyntaxError in code');
      obj = null;
    }

  return obj;
};
