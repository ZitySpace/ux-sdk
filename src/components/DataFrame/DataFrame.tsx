import React, { useEffect } from 'react';

import { usePagingStore } from '../../stores/pagingStore';
import { useDataframeStore } from '../../stores/dataframeStore';
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

  const [pos, step, setTotal] = useStore(
    usePagingStore(pagingStoreName),
    (s) => [s.pos, s.step, s.setTotal]
  );

  useEffect(() => {
    setTotal(data.length);
  }, []);

  return (
    <div className='bg-gray-100 h-full flex flex-col rounded-md shadow-lg'>
      <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2 text-xs'>
        <span>{title}</span>
      </div>
      <div className='resize-y overflow-auto h-48 bg-white '>
        <table className='min-w-full divide-y divide-gray-200 relative table-fixed'>
          <thead className='bg-gray-700 sticky top-0'>
            <tr>
              <th
                scope='col'
                className='px-3 py-2 text-left text-xs font-medium text-gray-200'
                onClick={() => toggleSelectSlice(pos, step)}
              >
                <input
                  type='checkbox'
                  className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-white w-3.5 h-3.5'
                  checked={!selected.slice(pos, pos + step).includes(false)}
                  readOnly
                />
              </th>

              {header.map((name, icol) => (
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
            {data.slice(pos, pos + step).map((row, irow) => (
              <tr
                key={irow}
                className='bg-white border-b'
                onClick={() => toggleSelect(pos + irow)}
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
      </div>
    </div>
  );
};

export default DataFrame;
