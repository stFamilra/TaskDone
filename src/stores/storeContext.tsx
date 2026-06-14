import { createContext } from 'react';
import RootStore from './RootStore';

const rootStore = new RootStore();

export const StoreContext = createContext<RootStore>(rootStore);
