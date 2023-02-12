import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryContext } from './queryProvider';
import { useStore, StoreApi } from 'zustand';
import { CarouselStore } from '../stores/carouselStore';
import { useAPIs } from './useAPIs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useCarouselDelSelectedImages = ({
  carouselStore,
}: {
  carouselStore: StoreApi<CarouselStore>;
}) => {
  const selectedImageNames = useStore(carouselStore, (s) => {
    const selected = s.selection.selected;
    return Object.keys(selected).filter((name) => selected[name]);
  });

  const { deleteImages } = useAPIs();

  const queryClient = useQueryClient({ context: queryContext });

  const deleteImagesMutation = useMutation(
    (imglist: string[]) => deleteImages(imglist),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['carouselSize']);
        queryClient.invalidateQueries(['carouselPage']);
        toast.success('Successfully deleted images');
      },
      onError: (err: string) => {
        toast.error(err);
      },
      context: queryContext,
    }
  );

  const delSelectedImages = () => {
    if (!selectedImageNames.length) {
      toast.warning('No images selected');
      return;
    }

    deleteImagesMutation.mutate(selectedImageNames);
  };

  return delSelectedImages;
};
