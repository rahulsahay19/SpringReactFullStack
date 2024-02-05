import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import ContactPage from "../../features/contact/ContactPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFoundError";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {path:'', element: <HomePage/>},
            {path:'store', element: <Catalog/>},
            {path:'store/:id', element: <ProductDetails/>},
            {path:'contact', element: <ContactPage/>},
            {path:'not-found', element: <NotFound/>},
            {path:'server-error', element: <ServerError/>}
        ]
    }
])