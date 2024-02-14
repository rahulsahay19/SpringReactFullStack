import { createContext, useContext, useState } from 'react';
import { Basket } from '../models/basket';

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = () => {
    // Implement logic to remove item from basket
  };


  return <StoreContext.Provider value={{basket,setBasket,removeItem}}>{children}</StoreContext.Provider>;
}
