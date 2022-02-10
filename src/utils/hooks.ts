import { useQuery, useMutation, QueryClient } from 'react-query';
import { usePagingStore } from '../stores/pagingStore';
import { useCarouselStore } from '../stores/carouselStore';
import { useContextStore } from '../stores/contextStore';
import { useAPIs } from './apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useHooks = () => {
  const [pos, step, setTotal] = usePagingStore((s) => [
    s.pos,
    s.step,
    s.setTotal,
  ]);

  const filtering = useContextStore((s) => s.filtering);

  const [setCarouselStateData, selectedImageNames] = useCarouselStore((s) => {
    const selected = s.selection.selected;
    return [
      s.setStateData,
      Object.keys(selected).filter((name) => selected[name]),
    ];
  });

  const {
    getImagesCount,
    getImagesMeta,
    getImage,
    getImagesCountByCategory,
    getImagesMetaByCategory,
    deleteImages,
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
        onSuccess: (total) => {
          setTotal(total);
        },
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

  const useImage = (name: string) => getImage(name);

  const queryClient = new QueryClient();

  const deleteImagesMutation = useMutation(
    (imglist: string[]) => deleteImages(imglist),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('carouselPage');
        toast.success('Successfully deleted images');
      },
      onError: (err: string) => {
        toast.error(err);
      },
    }
  );

  const deleteSelectedImages = () => {
    if (!selectedImageNames.length) {
      toast.warning('No images selected');
      return;
    }

    console.log(selectedImageNames);
    // deleteImagesMutation.mutate(selectedImageNames);
  };

  return {
    useCarouselSizeQuery,
    useCarouselPageQuery,
    useImage,
    deleteSelectedImages,
  };
};
