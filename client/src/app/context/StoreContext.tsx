import { createContext, useContext, useState, useEffect } from 'react';
import agent from '../api/agent';
import { Basket } from '../models/basket';
import { getBasketFromLocalStorage } from '../util/util';

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

  useEffect(() => {
    const loadBasket = async () => {
      const basketFromLocalStorage = getBasketFromLocalStorage();
      if (basketFromLocalStorage) {
        try {
          await agent.Basket.setBasket(basketFromLocalStorage);
          setBasket(basketFromLocalStorage);
        } catch (error) {
          console.error('Failed to set basket:', error);
        }
      }
    };

    loadBasket();
  }, []);

  const removeItem = (productId: number, quantity: number) => {
    // Implement logic to remove item from basket
  };

  const storeContextValue: StoreContextValue = {
    basket,
    setBasket,
    removeItem,
  };

  return <StoreContext.Provider value={storeContextValue}>{children}</StoreContext.Provider>;
}