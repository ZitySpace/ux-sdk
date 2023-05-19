import React from 'react';
import { atom, useAtom } from 'jotai';
import { atomWithDefault } from 'jotai/utils';

const count1Atom = atom(1);
const count2Atom = atomWithDefault((get) => get(count1Atom) * 2);

const PaginationBar = () => {
  const [count1, setCount1] = useAtom(count1Atom);
  const [count2, setCount2] = useAtom(count2Atom);

  return (
    <>
      <div>
        count1: {count1}, count2: {count2}
      </div>
      <button onClick={() => setCount1((c) => c + 1)}>increments count1</button>
      <button onClick={() => setCount2((c) => c + 1)}>increments count2</button>
      <div>fuc</div>
    </>
  );
};

export default PaginationBar;
