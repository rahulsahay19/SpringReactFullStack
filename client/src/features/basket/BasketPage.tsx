import { useEffect, useState } from "react";
import { Basket } from "../../app/models/basket";
import Spinner from "../../app/layout/Spinner";
import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from "../../app/models/product";

export default function BasketPage(){
    const [loading, setLoading] = useState(true);
    const [basket, setBasket] = useState<Basket | null>(null);

    // onload get the basket from local storage
    useEffect(() => {
        const storedBasket = localStorage.getItem('basket');
        if (storedBasket) {
            const parsedBasket: Basket = JSON.parse(storedBasket);
            setBasket(parsedBasket);
        }
        setLoading(false);
    }, []);

    const handleRemoveItem = (productId: number) => {
        // Implement the logic to remove the item from the basket
    };

    // Define the extractImageName function
    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    };

    // Function to format the price with INR currency symbol
    const formatPrice = (price: number): string =>{
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(price);
    };

    if (loading) return <Spinner message="Loading basket..." />;
    if (!basket || basket.items.length === 0) return <Typography variant="h3">Your basket is empty. Please add few items!!!</Typography>;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Image</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {item.pictureUrl && (
                                    <img src={"/images/products/"+extractImageName(item)} alt="Product" width="50" height="50" />
                                )}
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleRemoveItem(item.id)} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
