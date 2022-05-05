import { useState } from 'react';

type StateT<S> = [S, React.Dispatch<React.SetStateAction<S>>]; // not conflict with zustand State

function tryState<S>(state: StateT<S> | null, initialState: S) {
  return state ? state : useState<S>(initialState);
}
