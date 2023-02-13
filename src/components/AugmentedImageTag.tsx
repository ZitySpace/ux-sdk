import { fabric } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useCarouselStore } from '../stores/carouselStore';
import { useResizeDetector } from 'react-resize-detector';
import { RefreshIcon } from '@heroicons/react/solid';
import { useStore } from 'zustand';

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  category?: string;
}

export type AugmenterTypes = {
  (name: string, bboxes?: BoxProps[]): Promise<{
    imageSrc: string;
    augBoxes: BoxProps[];
  }>;
};

const AugmentedImageTag = ({
  name,
  augmenter,
  carouselStoreName = '.carouselStore',
}: {
  name: string;
  augmenter: AugmenterTypes;
  carouselStoreName?: string;
}) => {
  const annotations = useStore(
    useCarouselStore(carouselStoreName),
    (s) => s.carouselData[name].annotations
  );

  const [src, setSrc] = useState<string>(
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
  );

  const [boxes, setBoxes] = useState<BoxProps[]>([]);

  const imgElRef = useRef(null);
  const imgLoadedRef = useRef(false);
  const canvasElRef = useRef(null);
  const canvasRef = useRef<fabric.StaticCanvas | null>(null);

  // load image on mount
  useEffect(() => {
    const augment = async () => {
      const { imageSrc, augBoxes } = await augmenter(name, annotations!);

      setSrc(imageSrc);
      setBoxes(augBoxes);
      imgLoadedRef.current = true;
    };

    augment();
  }, [name]);

  const reAugment = async () => {
    const { imageSrc, augBoxes } = await augmenter(name, annotations!);
    setSrc(imageSrc);
    setBoxes(augBoxes);
  };

  const { width, height } = useResizeDetector({
    targetRef: imgElRef,
    refreshMode: 'debounce',
    refreshRate: 100,
    onResize: () => onImgLoad(),
  });

  // render canvas after image has loaded
  const onImgLoad = () => {
    URL.revokeObjectURL(src);
    const img: any = imgElRef.current;
    const cw = img.getBoundingClientRect().width;
    const ch = img.getBoundingClientRect().height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (canvasRef.current === null)
      canvasRef.current = new fabric.StaticCanvas(canvasElRef.current);

    const canvas = canvasRef.current;
    canvas.clear();
    canvas.setWidth(cw);
    canvas.setHeight(ch);

    boxes.map(({ x, y, w, h, category }: any) => {
      canvas.add(
        new fabric.Rect({
          left: (x * cw) / iw,
          top: (y * ch) / ih,
          originX: 'left',
          originY: 'top',
          width: (w * cw) / iw,
          height: (h * ch) / ih,
          fill: 'rgba(255,0,0,0)',
          stroke: 'red',
          strokeWidth: 1.5,
        })
      );
    });

    canvas.renderAll();
  };

  return (
    <div
      className='us-h-full us-select-none us-relative us-rounded-lg hover:us-shadow-md' // transform hover:scale-105 transition delay-100 duration-100 ease-in"
    >
      <img
        alt={name}
        title={name}
        src={src}
        loading='lazy'
        className='us-max-w-full us-max-h-full us-rounded-lg'
        onLoad={imgLoadedRef.current ? onImgLoad : () => {}}
        ref={imgElRef}
      />

      <canvas
        ref={canvasElRef}
        className='us-absolute us-top-0 us-rounded-lg'
      />

      <div
        className='us-absolute us-top-0 us-right-2 us-h-6 us-w-6 us-rounded-sm md:us-h-8 md:us-w-8 md:us-rounded-full us-flex us-justify-center us-items-center us-cursor-pointer us-bg-gray-200 hover:us-bg-indigo-600 hover:us-text-gray-100'
        onClick={reAugment}
      >
        <RefreshIcon className='us-h-4 us-w-4' />
      </div>
    </div>
  );
};

export default AugmentedImageTag;
