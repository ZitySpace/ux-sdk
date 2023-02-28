import { FilterProps } from '../stores/contextStore';
import { DataframeStoreData } from '../stores/dataframeStore';
import {
  CarouselStore,
  CarouselStoreDataDefault,
} from '../stores/carouselStore';

export const useFilterFromDataframe = (
  { header, data }: DataframeStoreData,
  groupByImage: boolean = false
) => {
  const idx = header.findIndex((v) => v === 'image_hash');

  if (!header.includes('image_hash')) {
    return {
      by: 'Dataframe',
      value: data,
      dependsOnValue: false,
      sizeFilter: () =>
        groupByImage && header.includes('image_hash')
          ? new Set(data.map((d) => d[idx])).size
          : data.length,
      pageFilter: (pos: number, step: number) => CarouselStoreDataDefault,
    };
  }

  const required = ['x', 'y', 'w', 'h', 'type'];
  const optional = ['category'];
  const pass = !required.some((field) => !header.includes(field));

  const rowDataToAnno = (d: any[]) =>
    pass
      ? Object.fromEntries(
          header
            .map((h, i) =>
              h === 'image_hash'
                ? ['name', d[i]]
                : required.includes(h) || optional.includes(h)
                ? [h, d[i]]
                : []
            )
            .filter((e) => e.length)
        )
      : { name: d[idx] };

  const groupByImageFunc: (data: any[][]) => CarouselStore['carouselData'] = (
    data: any[][]
  ) =>
    data.reduce((res: CarouselStore['carouselData'], d: any[]) => {
      const anno = rowDataToAnno(d);
      const name = anno.name;
      return {
        ...res,
        [name]: {
          name: name,
          annotations: pass
            ? [...(name in res ? res[name].annotations! : []), anno]
            : null,
        },
      };
    }, {});

  const initSelectionFunc = (carouselData: CarouselStore['carouselData']) => ({
    selectable: false,
    selected: Object.keys(carouselData).reduce(
      (sel, name) => ({ ...sel, [name]: false }),
      {}
    ),
  });

  let filter: FilterProps;

  if (groupByImage) {
    const dataGroupByImage = groupByImageFunc(data);
    const images = Object.keys(dataGroupByImage);

    filter = {
      by: 'DataframeGroupByImage',
      value: dataGroupByImage,
      dependsOnValue: false,
      sizeFilter: () => images.length,
      pageFilter: (pos: number, step: number) => {
        const carouselData = images
          .slice(pos, pos + step)
          .reduce(
            (res, name) => ({ ...res, [name]: dataGroupByImage[name] }),
            {}
          );
        const selection = initSelectionFunc(carouselData);

        return { carouselData, selection };
      },
    };
  } else {
    filter = {
      by: 'Dataframe',
      value: data,
      dependsOnValue: false,
      sizeFilter: () => data.length,
      pageFilter: (pos: number, step: number) => {
        const carouselData = groupByImageFunc(data.slice(pos, pos + step));
        const selection = initSelectionFunc(carouselData);

        return { carouselData, selection };
      },
    };
  }

  return filter;
};
