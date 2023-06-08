import produce from 'immer';
import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/solid';
import Modal from './Generic/modal';
import { ToastContainer } from 'react-toastify';
import { carouselDataAtom, useCarouselDelSelectedImages } from '../atoms';
import { useAtom } from 'jotai';

const ImageList = () => {
  const [carouselData, setCarouselData] = useAtom(carouselDataAtom);
  const selectable = carouselData.selection.selectable;
  const selected = carouselData.selection.selected;
  const allSelected = !Object.values(selected).includes(false);

  const toggleSelectable = () =>
    setCarouselData(
      produce((d) => {
        d.selection.selectable = !d.selection.selectable;
      })
    );

  const toggleImageSelect = (name: string) =>
    setCarouselData(
      produce((d) => {
        d.selection.selected[name] = !d.selection.selected[name];
      })
    );

  const toggleSelectAll = () =>
    setCarouselData(
      produce((d) => {
        const selected = d.selection.selected;
        const allSelected = !Object.values(selected).includes(false);
        Object.keys(selected).forEach(
          (name) => (selected[name] = !allSelected)
        );
      })
    );

  const deleteSelectedImages = useCarouselDelSelectedImages();

  const [delImgModalOpen, setDelImgModalOpen] = useState(false);

  return (
    <>
      <div className='us-bg-gray-100 us-h-full us-max-w-full us-flex us-flex-col us-text-xs us-shadow-lg us-rounded-md us-select-none'>
        <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2'>
          <span>Image List</span>
        </div>
        <div className='us-overflow-auto us-h-full us-max-w-full us-px-4 us-py-2 us-flex us-flex-col us-space-y-2'>
          <div className='us-p-0.5 us-rounded-lg us-flex us-flex-wrap'>
            <span
              onClick={toggleSelectable}
              className='us-m-0.5 us-inline-flex us-items-center us-px-2 us-py-1 us-border us-border-transparent us-shadow-sm us-text-xs us-leading-4 us-font-medium us-rounded-md us-text-white us-bg-indigo-500 hover:us-bg-indigo-600'
            >
              <input
                className='-us-ml-0.5 us-mr-2 us-h-2.5 us-w-2.5 us-border-none focus:us-outline-none focus:us-ring-0 focus:us-ring-offset-0 us-bg-gray-50'
                type='checkbox'
                checked={selectable}
                readOnly
              />
              Select on carousel
            </span>
            <button
              type='button'
              className='us-m-0.5 us-inline-flex us-items-center us-px-2 us-py-1 us-border us-border-transparent us-shadow-sm us-text-xs us-leading-4 us-font-medium us-rounded-md us-text-white us-bg-indigo-500 hover:us-bg-indigo-600 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-2 focus:us-ring-indigo-500'
              onClick={() => setDelImgModalOpen(true)}
            >
              <TrashIcon
                className='-us-ml-0.5 us-mr-2 us-h-3 us-w-3'
                aria-hidden='true'
              />
              Delete selected
            </button>
            {/* <button
              type='button'
              className='us-m-0.5 us-inline-flex us-items-center us-px-2 us-py-1 us-border us-border-transparent us-shadow-sm us-text-xs us-leading-4 us-font-medium us-rounded-md us-text-white us-bg-indigo-500 hover:us-bg-indigo-600 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-2 focus:us-ring-indigo-500'
            >
              <TrashIcon className='-us-ml-0.5 us-mr-2 us-h-3 us-w-3' aria-hidden='true' />
              Delete all
            </button> */}
          </div>

          <div className='us-shadow us-overflow-y-scroll us-border-b us-border-gray-200 sm:us-rounded-lg us-w-full us-h-full'>
            <table className='us-min-w-full us-divide-y us-divide-gray-200 us-relative us-table-fixed'>
              <thead className='us-bg-gray-200 us-sticky us-top-0'>
                <tr>
                  <th
                    scope='col'
                    className='us-px-3 us-py-2 us-text-left us-text-xs us-font-medium us-text-gray-500 us-w-1/8'
                    onClick={toggleSelectAll}
                  >
                    <input
                      type='checkbox'
                      className='us-border-none focus:us-outline-none focus:us-ring-0 focus:us-ring-offset-0 us-bg-white us-w-3.5 us-h-3.5'
                      checked={allSelected}
                      readOnly
                    />
                  </th>

                  <th
                    scope='col'
                    className='us-px-3 us-py-2 us-text-left us-text-xs us-font-medium us-text-gray-500 us-w-1/2'
                  >
                    Image
                  </th>
                  <th
                    scope='col'
                    className='us-px-3 us-py-2 us-text-center us-text-xs us-font-medium us-text-gray-500 us-w-1/8'
                  >
                    Size
                  </th>
                  <th
                    scope='col'
                    className='us-px-3 us-py-2 us-text-center us-text-xs us-font-medium us-text-gray-500 us-w-1/8'
                  >
                    #Annotations
                  </th>
                  <th
                    scope='col'
                    className='us-px-3 us-py-2 us-text-center us-text-xs us-font-medium us-text-gray-500 us-w-1/8'
                  >
                    UploadAt
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(carouselData.carouselData).map(
                  (imgObj: any, idx: number) => (
                    <tr
                      key={idx}
                      className={`us-bg-white us-border-b ${
                        selected[imgObj.name] ? 'us-bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        toggleImageSelect(imgObj.name);
                      }}
                    >
                      <td className='us-px-3 us-py-2 us-whtiespace-nowrap'>
                        <div className='us-flex us-items-center'>
                          <input
                            type='checkbox'
                            className='us-border-none focus:us-outline-none focus:us-ring-0 focus:us-ring-offset-0 us-bg-indigo-100 us-w-3.5 us-h-3.5'
                            checked={selected[imgObj.name]}
                            readOnly
                          />
                        </div>
                      </td>
                      <td className='us-px-3 us-py-2 us-whitespace-nowrap us-text-xs us-font-light us-text-gray-500 us-overflow-x-auto'>
                        {imgObj.name}
                      </td>
                      <td className='us-px-3 us-py-2 us-whitespace-nowrap us-text-center us-text-xs us-font-light us-text-gray-500 us-overflow-x-auto'>
                        {`${imgObj.height} x ${imgObj.width}`}
                      </td>
                      <td className='us-px-3 us-py-2 us-whitespace-nowrap us-text-center us-text-xs us-font-light us-text-gray-500 us-overflow-x-auto'>
                        {(imgObj.annotations || []).length}
                      </td>
                      <td className='us-px-3 us-py-2 us-whitespace-nowrap us-text-center us-text-xs us-font-light us-text-gray-500 us-overflow-x-auto'>
                        {new Date(imgObj.upload_time).toLocaleString()}
                      </td>
                    </tr>
                  )
                )}
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
