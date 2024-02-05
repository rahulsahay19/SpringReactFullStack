import { Product } from "../../app/models/product";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agent.Store.list()
    .then((products) => setProducts(products.content))
    .catch(error=> console.log(error))
    .finally(()=>setLoading(false))
  }, []);
  
if(loading) return <Spinner message='Loading Products...'/>
  
  return (
    <>
      <ProductList products={products}/>      
    </>
  )
}
