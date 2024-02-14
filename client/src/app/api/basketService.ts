import axios from "axios";
import { Product } from "../models/product";
import { Basket, BasketItem, BasketTotals } from "../models/basket";
import { createId } from "@paralleldrive/cuid2";

import { setBasket } from "../../features/basket/basketSlice";
import { Dispatch } from "redux";

class BasketService {
  apiUrl = "http://localhost:8080/api/baskets";

  async getBasketFromApi() {
    try {
      const response = await axios.get<Basket>(`${this.apiUrl}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to retrieve basket");
    }
  }

  async getBasket() {
    try {
      const basketString = localStorage.getItem('basket');
      if (basketString) {
        return JSON.parse(basketString) as Basket;
      } else {
        throw new Error("Basket not found in local storage");
      }
    } catch (error) {
      throw new Error("Failed to retrieve basket: " + error);
    }
  }

  async addItemToBasket(item: Product, quantity = 1, dispatch: Dispatch) {
    try {
      let basket = this.getCurrentBasket();

      if (!basket) {
        basket = await this.createBasket();
      }

      const itemToAdd = this.mapProductToBasket(item);
      basket.items = this.upsertItems(basket.items, itemToAdd, quantity);
      this.setBasket(basket, dispatch);

      // Calculate totals after updating the basket
      const totals = this.calculateTotals(basket);
      
      return { basket, totals };
    } catch (error) {
      throw new Error("Failed to add item to basket");
    }
  }

  // async removeItemFromBasket(basketId: string) {
  //   try {
  //     await axios.delete(`${this.apiUrl}/${basketId}`);
  //   } catch (error) {
  //     throw new Error("Failed to remove item from basket");
  //   }
  // }

  async remove(itemId: number, dispatch: Dispatch){
    const basket = this.getCurrentBasket();
    if(basket){
      const itemIndex = basket.items.findIndex((p)=>p.id === itemId);
      if(itemIndex !==-1){
        basket.items.splice(itemIndex, 1);
        this.setBasket(basket, dispatch);
      }
      //check if the basket is empty after removing the item
      if(basket.items.length === 0){
        //clear the basket from local storage
        localStorage.removeItem('basket_id');
        localStorage.removeItem('basket');        
      }
  }
}

async incrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch){
  const basket = this.getCurrentBasket();
  if(basket){
    const item = basket.items.find((p)=>p.id === itemId);
    if(item){
      item.quantity += quantity;
      if(item.quantity<1){
        item.quantity = 1; //Preventing -ve quantity
      }
      this.setBasket(basket, dispatch);
    }
  }
}

async decrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch){
  const basket = this.getCurrentBasket();
  if(basket){
    const item = basket.items.find((p)=>p.id === itemId);
    if(item && item.quantity > 1){
      item.quantity -= quantity;
      this.setBasket(basket, dispatch);
    }
  }
}

  async setBasket(basket: Basket,  dispatch: Dispatch) {
    try {
      await axios.post<Basket>(this.apiUrl, basket);
      localStorage.setItem('basket', JSON.stringify(basket));
      dispatch(setBasket(basket));
    } catch (error) {
      throw new Error("Failed to update basket");
    }
  }

  private getCurrentBasket() {
    const basketString = localStorage.getItem('basket');
    return basketString ? JSON.parse(basketString) as Basket : null;
  }

  private async createBasket(): Promise<Basket> {
    try {
      const newBasket: Basket = {
        id: createId(),
        items: []
      };
      localStorage.setItem('basket_id', newBasket.id);
      return newBasket;
    } catch (error) {
      throw new Error("Failed to create basket");
    }
  }

  private upsertItems(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    const existingItem = items.find(x => x.id === itemToAdd.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    }
    return items;
  }

  private mapProductToBasket(item: Product): BasketItem {
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      productBrand: item.productBrand,
      productType: item.productType
    };
  }

  private calculateTotals(basket: Basket): BasketTotals {
    const shipping = 0; // Assuming no shipping charges for now
    const subtotal = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + shipping;
    return { shipping, subtotal, total };
  }
}

export default new BasketService();
