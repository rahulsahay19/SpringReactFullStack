import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFoundError";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import SignInPage from "../../features/account/SignInPage";
import RegisterPage from "../../features/account/RegisterPage";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                element: <RequireAuth/>, children:[
                    {path:'checkout', element: <CheckoutPage/>},
                ] 
            },
            {path:'', element: <HomePage/>},
            {path:'store', element: <Catalog/>},
            {path:'store/:id', element: <ProductDetails/>},
            {path:'contact', element: <ContactPage/>},
            {path:'basket', element: <BasketPage/>},
            {path:'checkout', element: <CheckoutPage/>},
            {path:'login', element: <SignInPage/>},
            {path:'register', element: <RegisterPage/>},            
            {path:'not-found', element: <NotFound/>},
            {path:'server-error', element: <ServerError/>}
        ]
    }
])