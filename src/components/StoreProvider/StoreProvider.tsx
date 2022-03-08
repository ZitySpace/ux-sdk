import React from 'react';
import {
  CarouselStoreProvider,
  createCarouselStore,
} from '../../stores/carouselStore';

import {
  PagingStoreProvider,
  createPagingStore,
} from '../../stores/pagingStore';

import {
  ContextStoreProvider,
  createContextStore,
} from '../../stores/contextStore';

import { FilteringProps } from '../../stores/contextStore';

const StoreProvider = ({
  filteringInit = null,
  children,
}: {
  filteringInit?: null | FilteringProps;
  children?: React.ReactNode;
}) => {
  return (
    <ContextStoreProvider
      createStore={() => createContextStore({ filtering: filteringInit })}
    >
      <PagingStoreProvider createStore={createPagingStore}>
        <CarouselStoreProvider createStore={createCarouselStore}>
          {children}
        </CarouselStoreProvider>
      </PagingStoreProvider>
    </ContextStoreProvider>
  );
};

export default StoreProvider;
