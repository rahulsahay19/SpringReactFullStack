import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Props {
    products: Product[]; 
}

export default function ProductList({ products }: Props) {
  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid item xs={3} key={product.id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

