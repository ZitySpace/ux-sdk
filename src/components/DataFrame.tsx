import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { posAtom, stepAtom, totAtom, dataframeAtom } from '../atoms';

const DataFrame = ({
  title = 'DataFrame',
  hideTitle = false,
  flat = true,
  rounded = false,
}: {
  title?: string;
  hideTitle?: boolean;
  flat?: boolean;
  rounded?: boolean;
}) => {
  const { header, selected, getSize, getData, config } =
    useAtomValue(dataframeAtom);

  const [pos, setPos] = useAtom(posAtom);
  const step = useAtomValue(stepAtom);
  const setTotal = useSetAtom(totAtom);
  const [slice, setSlice] = useState<any[][]>([]);
  const [sel, setSel] = useState<boolean[]>([]);

  useEffect(() => {
    const init = async () => {
      setPos(0);
      setTotal(await getSize(false));
      setSel(selected);
    };

    init();
  }, [config]);

  useEffect(() => {
    const update = async () => {
      const data = await getData(pos, pos + step, false);
      setSlice(data);
    };

    update();
  }, [pos, step, getData]);

  const toggleSelect = (i: number) => {
    setSel(
      produce((s) => {
        s[i] = !s[i];
      })
    );
  };
  const toggleSelectSlice = (i: number, step: number) => {
    setSel(
      produce((s) => {
        const allSelected = !s.slice(i, i + step).includes(false);
        s.splice(i, step, ...Array(step).fill(!allSelected));
      })
    );
  };

  return (
    <div
      className={`us-bg-gray-100 us-h-full us-flex us-flex-col
    ${flat ? '' : 'us-shadow-lg'} ${rounded ? 'us-rounded-md' : ''}
    `}
    >
      {!hideTitle && (
        <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2 us-text-xs'>
          <span>{title}</span>
        </div>
      )}
      <div className='us-resize-y us-overflow-auto us-h-48 us-bg-white '>
        <table className='us-min-w-full us-divide-y us-divide-gray-200 us-relative us-table-fixed'>
          <thead className='us-bg-gray-700 us-sticky us-top-0'>
            <tr>
              <th
                scope='col'
                className='us-px-3 us-py-2 us-text-left us-text-xs us-font-medium us-text-gray-200'
                onClick={() => toggleSelectSlice(pos, step)}
              >
                <input
                  type='checkbox'
                  className='us-border-none focus:us-outline-none focus:us-ring-0 focus:us-ring-offset-0 us-bg-white us-w-3.5 us-h-3.5'
                  checked={
                    sel.slice(pos, pos + step).length
                      ? !sel.slice(pos, pos + step).includes(false)
                      : false
                  }
                  readOnly
                />
              </th>

              {header.map((name, icol) => (
                <th
                  scope='col'
                  key={icol}
                  className='us-px-3 us-py-2 us-text-left us-text-xs us-font-medium us-text-gray-200'
                >
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, irow) => (
              <tr
                key={irow}
                className='us-bg-white us-border-b'
                onClick={() => toggleSelect(pos + irow)}
              >
                <td className='us-px-3 us-py-2 us-whitespace-nowrap'>
                  <div className='us-flex us-items-center'>
                    <input
                      type='checkbox'
                      className='us-border-none focus:us-outline-none focus:us-ring-0 focus:us-ring-offset-0 us-bg-indigo-100 us-w-3.5 us-h-3.5'
                      checked={sel[pos + irow] || false}
                      readOnly
                    />
                  </div>
                </td>

                {row.map((cell, icol) => (
                  <td
                    key={icol}
                    className='us-px-3 us-py-2 us-whitespace-nowrap us-text-xs us-font-light us-text-gray-500 us-overflow-x-auto'
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataFrame;
