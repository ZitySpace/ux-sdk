import { createStore, StoreApi } from 'zustand';

interface RootStoreState {
  stores: { [key: string]: StoreApi<object> };
  registerStore: (name: string, store: StoreApi<object>) => void;
  getStore: (name: string) => StoreApi<object>;
  hasStore: (name: string) => boolean;
}

const rootStore = createStore<RootStoreState>()((set, get) => ({
  stores: {},
  registerStore: (name: string, store: StoreApi<object>) =>
    set((s) => ({ stores: { ...s.stores, [name]: store } })),
  getStore: (name: string) => get().stores[name],
  hasStore: (name: string) => get().stores.hasOwnProperty(name),
}));

function newUseStore<S extends object, D extends object>(
  createStoreFromData: (data: Partial<D>) => StoreApi<S>,
  storeDataDefault: D
) {
  const { registerStore, getStore, hasStore } = rootStore.getState();

  return (name: string, data: Partial<D> = {}, force: boolean = false) => {
    if (!hasStore(name)) {
      const store = createStoreFromData(data);
      registerStore(name, store);
      return store;
    }

    const store = getStore(name);
    if (force) store.setState({ ...storeDataDefault, ...data });

    return store as StoreApi<S>;
  };
}

export { newUseStore, rootStore };
