import React, { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationIcon, CheckCircleIcon } from '@heroicons/react/outline';

type ModalProps = {
  title: string;
  body: string;
  open: boolean;
  setOpen: Function;
  yesCallback: Function;
  confirmAlias?: string;
};

const Modal = ({
  title,
  body,
  open,
  setOpen,
  yesCallback,
  confirmAlias = 'Confirm',
}: ModalProps) => {
  const onClose = () => setOpen(false);
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        static
        className='us-fixed us-z-40 us-inset-0 us-overflow-y-auto'
        initialFocus={cancelButtonRef}
        open={open}
        onClose={onClose}
      >
        <div className='us-flex us-items-center us-justify-center us-h-screen us-py-4 us-px-4 us-text-center sm:us-block sm:us-p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='us-fixed us-inset-0 us-bg-gray-500 us-bg-opacity-75 us-transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='us-hidden sm:us-inline-block sm:us-align-middle sm:us-h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='us-inline-block us-align-bottom us-bg-white us-rounded-lg us-text-left us-overflow-hidden us-shadow-xl us-transform us-transition-all sm:us-my-8 sm:us-align-middle sm:us-max-w-lg'>
              <div className='us-bg-white us-px-4 us-pt-5 us-pb-4 sm:us-p-6 sm:us-pb-4'>
                <div className='sm:us-flex sm:us-items-start'>
                  <div className='us-mx-auto us-flex-shrink-0 us-flex us-items-center us-justify-center us-h-12 us-w-12 us-rounded-full us-bg-red-100 sm:us-mx-0 sm:us-h-10 sm:us-w-10'>
                    <ExclamationIcon
                      className={`us-h-6 us-w-6 us-text-red-600`}
                      aria-hidden='true'
                    />
                  </div>
                  <div className='us-mt-3 us-text-center sm:us-mt-0 sm:us-ml-4 sm:us-text-left'>
                    <Dialog.Title
                      as='h3'
                      className='us-text-lg us-leading-6 us-font-medium us-text-gray-900'
                    >
                      {title}
                    </Dialog.Title>
                    <div className='us-mt-2'>
                      <p className='us-text-sm us-text-gray-500'>{body}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='us-bg-gray-50 us-px-4 us-py-3 sm:us-px-6 sm:us-flex sm:us-flex-row-reverse'>
                <button
                  type='button'
                  className='us-w-full us-inline-flex us-justify-center us-rounded-md us-border us-border-transparent us-shadow-sm us-px-4 us-py-2 us-bg-red-600 us-text-base us-font-medium us-text-white hover:us-bg-red-700 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-2 focus:us-ring-red-500 sm:us-ml-3 sm:us-w-auto sm:us-text-sm'
                  onClick={() => {
                    yesCallback();
                    setOpen(false);
                  }}
                >
                  {confirmAlias}
                </button>
                <button
                  type='button'
                  className='us-mt-3 us-w-full us-inline-flex us-justify-center us-rounded-md us-border us-border-gray-300 us-shadow-sm us-px-4 us-py-2 us-bg-white us-text-base us-font-medium us-text-gray-700 hover:us-bg-gray-50 focus:us-outline-none focus:us-ring-2 focus:us-ring-offset-2 focus:us-ring-indigo-500 sm:us-mt-0 sm:us-ml-3 sm:us-w-auto sm:us-text-sm'
                  onClick={onClose}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
