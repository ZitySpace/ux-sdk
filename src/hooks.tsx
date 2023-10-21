import produce from 'immer';
import React, { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import {
  posAtom,
  stepAtom,
  totAtom,
  filterAtom,
  filterAtomMap,
  carouselDataAtom,
  deleteImagesAtom,
} from './atoms';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();
export const queryContext = React.createContext<QueryClient | undefined>(
  undefined
);

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient} context={queryContext}>
      {children}
    </QueryClientProvider>
  );
};

// atom hooks
export const useCarouselSetSize = () => {
  const setTotal = useSetAtom(totAtom);
  const filter = useAtomValue(filterAtom);
  const { config, sizeFilter } = useAtomValue(filterAtomMap[filter.choice]);

  const {
    data: total,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['carouselSize', config],
    queryFn: sizeFilter,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    context: queryContext,
  });

  useEffect(() => {
    if (isSuccess) setTotal(total);
  }, [isSuccess, total]);

  return { isLoading };
};

export const useCarouselSetPage = () => {
  const pos = useAtomValue(posAtom);
  const step = useAtomValue(stepAtom);
  const setCarouselData = useSetAtom(carouselDataAtom);
  const filter = useAtomValue(filterAtom);
  const { config, pageFilter } = useAtomValue(filterAtomMap[filter.choice]);

  const {
    data: carouselData,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ['carouselPage', pos, step, config],
    queryFn: () => pageFilter(pos, step, 'upload_time'),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    context: queryContext,
  });

  useEffect(() => {
    if (isSuccess)
      setCarouselData(
        produce((d) => {
          d.carouselData = carouselData.carouselData;
          d.selection.selected = carouselData.selection.selected;
          d.switchOfFreshData = !d.switchOfFreshData;
        })
      );
  }, [isSuccess, carouselData]);

  return { isLoading };
};

export const useCarouselDelSelectedImages = () => {
  const carouselData = useAtomValue(carouselDataAtom);
  const selected = carouselData.selection.selected;
  const selectedImageNames = Object.keys(selected).filter(
    (name) => selected[name]
  );

  const deleteImages = useAtomValue(deleteImagesAtom);
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
