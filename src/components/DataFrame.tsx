import React, { useEffect } from 'react';

import { usePagingStore } from '../stores/pagingStore';
import { useDataframeStore } from '../stores/dataframeStore';
import { useStore } from 'zustand';

const DataFrame = ({
  title = 'DataFrame',
  dataframeStoreName = '.dataframeStore',
  pagingStoreName = '.pagingStore',
}: {
  title?: string;
  dataframeStoreName?: string;
  pagingStoreName?: string;
}) => {
  const [header, data, selected, toggleSelect, toggleSelectSlice] = useStore(
    useDataframeStore(dataframeStoreName),
    (s) => [s.header, s.data, s.selected, s.toggleSelect, s.toggleSelectSlice]
  );

  const [pos, step, setPos, setTotal] = useStore(
    usePagingStore(pagingStoreName),
    (s) => [s.pos, s.step, s.setPos, s.setTotal]
  );

  useEffect(() => {
    setPos(0);
    setTotal(data.length);
  }, [header, data]);

  return (
    <div className='us-bg-gray-100 us-h-full us-flex us-flex-col us-rounded-md us-shadow-lg'>
      <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2 us-text-xs'>
        <span>{title}</span>
      </div>
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
                    selected.slice(pos, pos + step).length
                      ? !selected.slice(pos, pos + step).includes(false)
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
            {data.slice(pos, pos + step).map((row, irow) => (
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
                      checked={selected[pos + irow] || false}
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
