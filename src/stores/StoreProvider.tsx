import React from 'react';
import { StoreContext } from '@/stores/storeContext';
import RootStore from '@/stores/RootStore';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <StoreContext.Provider value={new RootStore()}>{children}</StoreContext.Provider>;
};
