import { Product } from "../../app/models/product";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.content)) {
          // Access the 'content' property and ensure it's an array
          setProducts(data.content);
        } else {
          console.error("API response 'content' is not an array:", data);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);   
  
  return (
    <>
      <ProductList products={products}/>      
    </>
  )
}
