import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { Product } from "../models/product";
import BasketService from "./basketService";
import { BasketItem } from "../models/basket";

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
            // Create a BasketItem from the Product
            const basketItem: BasketItem = {
                id: product.id,  // Assuming id is the unique identifier for the product
                name: product.name,
                description: product.description,
                price: product.price,
                pictureUrl: product.pictureUrl,
                productBrand: product.productBrand,
                productType: product.productType,
                quantity: 1  // Default quantity for a new item
            };

            await BasketService.addItemToBasket(product);
        } catch (error) {
            console.error("Failed to add item to basket:", error);
            throw error;
        }
    },
    removeItem: async (basketId: string) => {
        try {
            await BasketService.removeItemFromBasket(basketId);
        } catch (error) {
            console.error("Failed to remove item from basket:", error);
            throw error;
        }
    }
}

const agent = {
    Store,
    Basket    
}

export default agent;
