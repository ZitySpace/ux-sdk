import produce from 'immer';
import React, { useEffect, useRef, useReducer } from 'react';
import {
  Annotator as AnnotatorCore,
  ImageData,
  LabelConfigs,
} from '@zityspace/react-annotate';
import {
  carouselDataAtom,
  getImageAtom,
  saveAnnotationsAtom,
  renameCategoryAtom,
  ImageProps,
} from '../atoms';
import { useAtom, useAtomValue } from 'jotai';

const Annotator = () => {
  const [carouselData, setCarouselData] = useAtom(carouselDataAtom);
  const switchOfFreshData = carouselData.switchOfFreshData;
  const setImageData = (name: string, data: ImageProps) =>
    setCarouselData(
      produce((d) => {
        d.carouselData[name] = data;
      })
    );

  const getImage = useAtomValue(getImageAtom);
  const saveAnnotations = useAtomValue(saveAnnotationsAtom);
  const renameCategory = useAtomValue(renameCategoryAtom);

  const imagesListRef: React.MutableRefObject<ImageData[]> = useRef<
    ImageData[]
  >([]);

  const labelConfigsRef: React.MutableRefObject<LabelConfigs> =
    useRef<LabelConfigs>({});

  const forceUpdate = useReducer(() => ({}), {})[1] as () => void;

  // hack: use switchOfFreshData to differentiate two cases:
  // 1. carouselData mutated by setCarouselData due to
  // fetching data of a new page or filtering condition change
  // 2. carouselData mutated by setImageData due to onSave
  // triggered by react-annotate Annotator component
  // so use imagesListRef instead of imagesList to only re-render
  // Annotator for the first case
  useEffect(() => {
    // be careful here, carouselData is immutable, so we need to
    // pass a deep copy of it to AnnotatorCore
    imagesListRef.current = JSON.parse(
      JSON.stringify(Object.values(carouselData.carouselData))
    ) as ImageData[];

    // set labelConfigsRef properly
    labelConfigsRef.current = {};
    let keypointsStructure: [number, number][] | undefined = undefined;

    if (
      imagesListRef.current.length &&
      imagesListRef.current[0].annotations.length
    )
      keypointsStructure = (imagesListRef.current[0].annotations[0] as any)
        .structure;

    if (keypointsStructure)
      labelConfigsRef.current['keypoints'] = {
        structure: keypointsStructure,
      };

    forceUpdate();
  }, [switchOfFreshData]);

  const onSave = async (curImageData: ImageData) => {
    // backend side
    await saveAnnotations(curImageData);

    // client carousel side
    setImageData(curImageData.name, {
      ...carouselData.carouselData[curImageData.name],
      annotations: curImageData.annotations,
    });
    return true;
  };

  const onRenameCategory = async (
    oldCategory: string,
    newCategory: string,
    timestamp?: string
  ) => {
    const categories = await renameCategory(
      oldCategory,
      newCategory,
      timestamp
    );

    console.log(oldCategory, ' -> ', newCategory, ' @ ', timestamp);
    return true;
  };

  return (
    <div className='us-bg-gray-100 us-h-96 us-min-h-full us-flex us-flex-col us-text-xs us-shadow-lg us-rounded-md us-relative us-select-none'>
      <div className='us-bg-indigo-400 us-py-2 us-px-2 us-rounded-t-md us-flex us-justify-center us-space-x-2'>
        <span>Annotator</span>
      </div>

      {imagesListRef.current.length > 0 && (
        <AnnotatorCore
          imagesList={imagesListRef.current}
          getImage={getImage}
          onSave={onSave}
          onError={(m: string, c: any) => {
            console.log(m, c);
          }}
          onAddCategory={async (c: string) => {
            console.log('add new category ', c);
            return true;
          }}
          onRenameCategory={onRenameCategory}
          labelConfigs={labelConfigsRef.current}
        />
      )}
    </div>
  );
};

export default Annotator;
