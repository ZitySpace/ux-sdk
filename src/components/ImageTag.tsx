import { CheckCircleIcon } from '@heroicons/react/solid';
import { fabric } from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useCarouselStore } from '../stores/carouselStore';
import { useAPIs } from '../hooks';
import { useResizeDetector } from 'react-resize-detector';
import { ColorStore } from '@zityspace/react-annotate';
import { useStore } from 'zustand';

const ImageTag = ({
  name,
  carouselStoreName = '.carouselStore',
}: {
  name: string;
  carouselStoreName?: string;
}) => {
  const [
    selectable,
    toggleImageSelect,
    isSelected,
    annotations,
    imgWidth,
    imgHeight,
  ] = useStore(useCarouselStore(carouselStoreName), (s) => [
    s.selection.selectable,
    s.selection.toggleImageSelect,
    s.selection.selected[name],
    s.carouselData[name].annotations,
    s.carouselData[name].width,
    s.carouselData[name].height,
  ]);

  const { getImage } = useAPIs();

  const getColor = useStore(ColorStore, (s) => s.getColor);

  const [src, setSrc] = useState<string>(
    'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D'
  );
  const imgElRef = useRef(null);
  const imgLoadedRef = useRef(false);
  const canvasElRef = useRef(null);
  const canvasRef = useRef<fabric.StaticCanvas | null>(null);

  // load image on mount
  useEffect(() => {
    (async () => setSrc(await getImage(name)))();
    imgLoadedRef.current = true;
  }, [name, annotations]);

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
    const iw = imgWidth || img.naturalWidth;
    const ih = imgHeight || img.naturalHeight;

    if (canvasRef.current === null)
      canvasRef.current = new fabric.StaticCanvas(canvasElRef.current);

    const canvas = canvasRef.current;
    canvas.clear();
    canvas.setWidth(cw);
    canvas.setHeight(ch);

    annotations &&
      annotations.map(({ x, y, w, h, category, color }: any) => {
        canvas.add(
          new fabric.Rect({
            left: (x * cw) / iw,
            top: (y * ch) / ih,
            originX: 'left',
            originY: 'top',
            width: (w * cw) / iw,
            height: (h * ch) / ih,
            fill: 'rgba(255,0,0,0)',
            stroke: color || getColor(category) || 'red',
            strokeWidth: 1.5,
          })
        );
      });

    canvas.renderAll();
  };

  return (
    <div
      className='h-full select-none relative rounded-lg hover:shadow-md' // transform hover:scale-105 transition delay-100 duration-100 ease-in"
    >
      <img
        alt={name}
        title={name}
        src={src}
        loading='lazy'
        className='max-w-full max-h-full rounded-lg'
        onLoad={imgLoadedRef.current ? onImgLoad : () => {}}
        ref={imgElRef}
      />

      <canvas ref={canvasElRef} className='absolute top-0 rounded-lg' />

      {selectable ? (
        <CheckCircleIcon
          className={`absolute top-0 h-8 w-8 ${
            isSelected ? 'text-indigo-600' : 'text-gray-600'
          }`}
          onClick={() => toggleImageSelect(name)}
        />
      ) : null}
    </div>
  );
};

export default ImageTag;
