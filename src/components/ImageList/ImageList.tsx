import React, { useState, useRef, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/solid';
import { useDelImages } from '../../utils/hooks/useDelImages';
import {
  useCarouselStore,
  CarouselStoreData,
  CarouselStoreDataDefault,
} from '../../stores/carouselStore';
import Modal from '../Generic/modal';
import { ToastContainer } from 'react-toastify';
import { useStore } from 'zustand';

const ImageList = ({
  storeName = '.carouselStore',
  storeInit = CarouselStoreDataDefault,
  resetOnFirstMount = false,
}: {
  storeName?: string;
  storeInit?: CarouselStoreData;
  resetOnFirstMount?: boolean;
}) => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);

  const store = useCarouselStore(
    storeName,
    storeInit,
    resetOnFirstMount && !mounted.current
  );

  const deleteSelectedImages = useDelImages({ carouselStore: store });

  const [
    selectable,
    selected,
    allSelected,
    toggleSelectable,
    toggleImageSelect,
    toggleSelectAll,
    carouselData,
  ] = useStore(store, (s) => [
    s.selection.selectable,
    s.selection.selected,
    !Object.values(s.selection.selected).includes(false),
    s.selection.toggleSelectable,
    s.selection.toggleImageSelect,
    s.selection.toggleSelectAll,
    s.carouselData,
  ]);

  const [delImgModalOpen, setDelImgModalOpen] = useState(false);

  return (
    <>
      <div className='bg-gray-100 h-full max-w-full flex flex-col text-xs shadow-lg rounded-md select-none'>
        <div className='bg-indigo-400 py-2 px-2 rounded-t-md flex justify-center space-x-2'>
          <span>Image List</span>
        </div>
        <div className='overflow-auto h-full max-w-full px-4 py-2 flex flex-col space-y-2'>
          <div className='p-0.5 rounded-lg flex flex-wrap'>
            <span
              onClick={toggleSelectable}
              className='m-0.5 inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600'
            >
              <input
                className='-ml-0.5 mr-2 h-2.5 w-2.5 border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-gray-50'
                type='checkbox'
                checked={selectable}
                readOnly
              />
              Select on carousel
            </span>
            <button
              type='button'
              className='m-0.5 inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              onClick={() => setDelImgModalOpen(true)}
            >
              <TrashIcon className='-ml-0.5 mr-2 h-3 w-3' aria-hidden='true' />
              Delete selected
            </button>
            {/* <button
              type='button'
              className='m-0.5 inline-flex items-center px-2 py-1 border border-transparent shadow-sm text-xs leading-4 font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <TrashIcon className='-ml-0.5 mr-2 h-3 w-3' aria-hidden='true' />
              Delete all
            </button> */}
          </div>

          <div className='shadow overflow-y-scroll border-b border-gray-200 sm:rounded-lg w-full h-full'>
            <table className='min-w-full divide-y divide-gray-200 relative table-fixed'>
              <thead className='bg-gray-200 sticky top-0'>
                <tr>
                  <th
                    scope='col'
                    className='px-3 py-2 text-left text-xs font-medium text-gray-500 w-1/8'
                    onClick={toggleSelectAll}
                  >
                    <input
                      type='checkbox'
                      className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-white w-3.5 h-3.5'
                      checked={allSelected}
                      readOnly
                    />
                  </th>

                  <th
                    scope='col'
                    className='px-3 py-2 text-left text-xs font-medium text-gray-500 w-1/2'
                  >
                    Image
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-2 text-center text-xs font-medium text-gray-500 w-1/8'
                  >
                    Size
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-2 text-center text-xs font-medium text-gray-500 w-1/8'
                  >
                    #Annotations
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-2 text-center text-xs font-medium text-gray-500 w-1/8'
                  >
                    UploadAt
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(carouselData).map((imgObj: any, idx: number) => (
                  <tr
                    key={idx}
                    className={`bg-white border-b ${
                      selected[imgObj.name] ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => {
                      toggleImageSelect(imgObj.name);
                    }}
                  >
                    <td className='px-3 py-2 whtiespace-nowrap'>
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          className='border-none focus:outline-none focus:ring-0 focus:ring-offset-0 bg-indigo-100 w-3.5 h-3.5'
                          checked={selected[imgObj.name]}
                          readOnly
                        />
                      </div>
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap text-xs font-light text-gray-500 overflow-x-auto'>
                      {imgObj.name}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap text-center text-xs font-light text-gray-500 overflow-x-auto'>
                      {`${imgObj.height} x ${imgObj.width}`}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap text-center text-xs font-light text-gray-500 overflow-x-auto'>
                      {imgObj.annotations.length}
                    </td>
                    <td className='px-3 py-2 whitespace-nowrap text-center text-xs font-light text-gray-500 overflow-x-auto'>
                      {new Date(imgObj.upload_time).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        title='Delete selected images?'
        body='Delete images will also delete related annotations. This action cannot be undone.'
        open={delImgModalOpen}
        setOpen={setDelImgModalOpen}
        yesCallback={deleteSelectedImages}
        confirmAlias='Delete'
      />
      <ToastContainer autoClose={2500} hideProgressBar={true} theme='light' />
    </>
  );
};

export default ImageList;
