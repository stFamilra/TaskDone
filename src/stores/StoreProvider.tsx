import React from 'react';
import { StoreContext } from '@/stores/storeContext';
import RootStore from '@/stores/RootStore';

interface StoreProviderProps {
  children: React.ReactNode;
  store?: RootStore;
}

export const StoreProvider = ({ children, store = new RootStore() }: StoreProviderProps) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
