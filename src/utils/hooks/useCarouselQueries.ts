import { useQuery } from 'react-query';
import { usePagingStore } from '../../stores/pagingStore';
import { useCarouselStore } from '../../stores/carouselStore';
import { useContextStore } from '../../stores/contextStore';
import { useAPIs } from '../apis';

export const useCarouselQueries = () => {
  const [pos, step, setTotal] = usePagingStore((s) => [
    s.pos,
    s.step,
    s.setTotal,
  ]);

  const filtering = useContextStore((s) => s.filtering);

  const setCarouselStateData = useCarouselStore((s) => s.setStateData);

  const {
    getImagesCount,
    getImagesMeta,
    getImagesCountByCategory,
    getImagesMetaByCategory,
  } = useAPIs();

  const useCarouselSizeQuery = () =>
    useQuery(
      'carouselSize',
      filtering
        ? async () =>
            filtering.by === 'Category'
              ? getImagesCountByCategory(filtering.value)
              : filtering.by === 'ImageNames'
              ? filtering.value.length
              : 1000 // fallback value
        : getImagesCount,
      {
        onSuccess: (total) => setTotal(total),
        keepPreviousData: true,
        refetchOnWindowFocus: false, // this option is very important
      }
    );

  const useCarouselPageQuery = () =>
    useQuery(
      ['carouselPage', pos, step],
      async () =>
        filtering
          ? filtering.by === 'Category'
            ? getImagesMetaByCategory(filtering.value, pos, step, 'upload_time')
            : {
                carouselData: {},
                selection: { selectable: true, selected: [] },
              }
          : getImagesMeta(pos, step, 'upload_time'),
      {
        onSuccess: (carouselStateData) =>
          setCarouselStateData(carouselStateData),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    );

  return {
    useCarouselSizeQuery,
    useCarouselPageQuery,
  };
};
