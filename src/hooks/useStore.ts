import { useContext } from 'react';
import { StoreContext } from '@/stores/storeContext';

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
