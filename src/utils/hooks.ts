import { useQuery } from 'react-query';
import { usePagingStore } from '../stores/pagingStore';
import { useCarouselStore } from '../stores/carouselStore';
import { useAPIs } from './apis';

export const useHooks = () => {
  const [pos, step, setTotal] = usePagingStore((s) => [
    s.pos,
    s.step,
    s.setTotal,
  ]);

  const setCarouselStateData = useCarouselStore((s) => s.setStateData);

  const { getImagesCount, getImagesMeta, getImage } = useAPIs();

  const useCarouselSizeQuery = () =>
    useQuery('carouselSize', getImagesCount, {
      onSuccess: (total) => {
        setTotal(total);
      },
      refetchOnWindowFocus: false, // this option is very important
    });

  const useCarouselPageQuery = () =>
    useQuery(
      ['carouselPage', pos, step],
      async () => getImagesMeta(pos, step, 'upload_time'),
      {
        onSuccess: (carouselStateData) =>
          setCarouselStateData(carouselStateData),
        refetchOnWindowFocus: false,
      }
    );

  const useImage = (name: string) => getImage(name);

  return { useCarouselSizeQuery, useCarouselPageQuery, useImage };
};
