// agent.ts

import axios from "axios";
import { Product } from "../models/product";
import BasketService from "./basketService";
import { Basket as BasketModel } from "../models/basket";
import { Dispatch } from "redux";

axios.defaults.baseURL = 'http://localhost:8080/api/';

const requests = {
  get: (url: string) => axios.get(url).then(response => response.data),
  post: (url: string, body: object) => axios.post(url, body).then(response => response.data),
  put: (url: string, body: object) => axios.put(url, body).then(response => response.data),
  delete: (url: string) => axios.delete(url).then(response => response.data)
};

const Store = {
  apiUrl: 'http://localhost:8080/api/products',
  list: (page: number, size: number, brandId?: number, typeId?: number, url?: string) => {
    let requestUrl = url ? url : `products?page=${page - 1}&size=${size}`;
    if (brandId !== undefined) {
      requestUrl += `&brandId=${brandId}`;
    }
    if (typeId !== undefined) {
      requestUrl += `&typeId=${typeId}`;
    }
    return requests.get(requestUrl);
  },
  details: (id: number) => requests.get(`products/${id}`),
  types: () => requests.get('products/types').then(types => [{ id: 0, name: 'All' }, ...types]),
  brands: () => requests.get('products/brands').then(brands => [{ id: 0, name: 'All' }, ...brands]),
  search: (keyword: string) => requests.get(`products?keyword=${keyword}`),
};

const Basket = {
  get: async () => {
    try {
      return await BasketService.getBasket();
    } catch (error) {
      console.error("Failed to get basket:", error);
      throw error;
    }
  },
  addItem: async (product: Product, dispatch: Dispatch) => {
    try {
      const result = await BasketService.addItemToBasket(product, 1, dispatch);
      console.log(result);
      return result;
    } catch (error) {
      console.error("Failed to add item to basket:", error);
      throw error;
    }
  },
  removeItem: async (itemId: number, dispatch: Dispatch) => {
    try {
      await BasketService.remove(itemId, dispatch);
    } catch (error) {
      console.error("Failed to remove item from basket:", error);
      throw error;
    }
  },
  incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
    try {
      await BasketService.incrementItemQuantity(itemId, quantity, dispatch);
    } catch (error) {
      console.error("Failed to increment item quantity in basket:", error);
      throw error;
    }
  },
  decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
    try {
      await BasketService.decrementItemQuantity(itemId, quantity, dispatch);
    } catch (error) {
      console.error("Failed to decrement item quantity in basket:", error);
      throw error;
    }
  },
  setBasket: async (basket: BasketModel, dispatch: Dispatch) => {
    try {
      await BasketService.setBasket(basket, dispatch);
    } catch (error) {
      console.error("Failed to set basket:", error);
      throw error;
    }
  }
};

const agent = {
  Store,
  Basket    
};

export default agent;
