import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { Product } from "../models/product";
import BasketService from "./basketService";
import { Basket as BasketModel } from "../models/basket";

const idle = () => new Promise(resolve => setTimeout(resolve, 100));

axios.defaults.baseURL = 'http://localhost:8080/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await idle();
    return response
}, (error: AxiosError) => {
    const {status} = error.response as AxiosResponse;
    switch (status){
        case 404:
            toast.error("Resource not found");
            router.navigate('/not-found');
            break;
        case 401:
            toast.error("Unauthorized");
            break;
        case 500:
            toast.error("Internal Server Error");
            router.navigate('/server-error');
            break;
        default:
            break;
    }
    return Promise.reject(error.message);
})

const requests ={
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody)
}

const Store = {
    list:()=> requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const Basket = {
    get: async () => {
        try {
            return await BasketService.getBasket();
        } catch (error) {
            console.error("Failed to get basket:", error);
            throw error;
        }
    },
    addItem: async (product: Product) => {
        try {
            await BasketService.addItemToBasket(product);
        } catch (error) {
            console.error("Failed to add item to basket:", error);
            throw error;
        }
    },
    removeItem: async (itemId: number) => {
        try {
            await BasketService.remove(itemId);
        } catch (error) {
            console.error("Failed to remove item from basket:", error);
            throw error;
        }
    },
    incrementItemQuantity: async (itemId: number, quantity: number = 1) => {
        try {
            await BasketService.incrementItemQuantity(itemId, quantity);
        } catch (error) {
            console.error("Failed to increment item quantity in basket:", error);
            throw error;
        }
    },
    decrementItemQuantity: async (itemId: number, quantity: number = 1) => {
        try {
            await BasketService.decrementItemQuantity(itemId, quantity);
        } catch (error) {
            console.error("Failed to decrement item quantity in basket:", error);
            throw error;
        }
    },
    setBasket: async (basket: BasketModel) => {
        try {
            await BasketService.setBasket(basket);
        } catch (error) {
            console.error("Failed to set basket:", error);
            throw error;
        }
    }
    
}

const agent = {
    Store,
    Basket    
}

export default agent;
