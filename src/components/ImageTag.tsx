import produce from 'immer';
import { CheckCircleIcon } from '@heroicons/react/solid';
import * as fabric from 'fabric';
import React, { useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import {
  ColorStore,
  BoxLabel,
  MaskLabel,
  KeypointsLabel,
  Label,
  Annotations,
} from '@zityspace/react-annotate';
import { useStore } from 'zustand';
import { useAtom, useAtomValue } from 'jotai';
import { carouselDataAtom, getImageAtom } from '../atoms';

const ImageTag = ({ name }: { name: string }) => {
  const [carouselData, setCarouselData] = useAtom(carouselDataAtom);
  const selectable = carouselData.selection.selectable;
  const toggleImageSelect = (name: string) =>
    setCarouselData(
      produce((d) => {
        d.selection.selected[name] = !d.selection.selected[name];
      })
    );
  const isSelected = carouselData.selection.selected[name];
  const {
    annotations,
    width: imgWidth,
    height: imgHeight,
  } = carouselData.carouselData[name];

  const getImage = useAtomValue(getImageAtom);

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

  // const { width, height } = useResizeDetector({
  //   targetRef: imgElRef,
  //   refreshMode: 'debounce',
  //   refreshRate: 100,
  //   onResize: () => onImgLoad(),
  // });

  // render canvas after image has loaded
  const onImgLoad = () => {
    URL.revokeObjectURL(src);
    const img: any = imgElRef.current;
    const cw = img.getBoundingClientRect().width;
    const ch = img.getBoundingClientRect().height;
    const iw = imgWidth || img.naturalWidth;
    const ih = imgHeight || img.naturalHeight;

    if (canvasRef.current === null)
      canvasRef.current = new fabric.StaticCanvas(canvasElRef.current!);

    const canvas = canvasRef.current;
    canvas.clear();
    canvas.setDimensions({ width: cw, height: ch });

    const scale_x = cw / iw;
    const scale_y = ch / ih;
    const scale = Math.min(scale_x, scale_y);
    const offset = {
      x: (cw - iw * scale) / 2,
      y: (ch - ih * scale) / 2,
    };

    annotations &&
      (JSON.parse(JSON.stringify(annotations)) as Annotations).map(
        (anno, id) => {
          let label: Label | null = null;

          if (anno.type === 'box') {
            label = new BoxLabel({
              ...anno,
              id,
            });
          } else if (anno.type === 'mask') {
            label = new MaskLabel({
              ...anno,
              id,
            });
          } else if (anno.type === 'keypoints') {
            label = new KeypointsLabel({
              ...anno,
              id,
            });
          }

          if (label === null) return;

          const canvasObjects = label
            .toCanvasCoordSystem({ scale, offset }, false)
            .toCanvasObjects(getColor(anno.category) || 'red', 'preview')
            .flat(2);

          // in fabric v6, static canvas expects BaseFabricObject[] but its type is not exposed yet, convert to any for now
          canvas.add(...(canvasObjects as any));
        }
      );

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
        className='us-absolute us-top-0 us-left-0 us-rounded-lg'
      />

      {selectable ? (
        <CheckCircleIcon
          className={`us-absolute us-top-0 us-h-8 us-w-8 ${
            isSelected ? 'us-text-indigo-600' : 'us-text-gray-600'
          }`}
          onClick={() => toggleImageSelect(name)}
        />
      ) : null}
    </div>
  );
};

export default ImageTag;
