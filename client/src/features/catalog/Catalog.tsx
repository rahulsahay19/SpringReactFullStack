import { Product } from "../../app/models/product";
import { useState, useEffect } from "react";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";
import Spinner from "../../app/layout/Spinner";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Brand } from "../../app/models/brand";
import { Type } from "../../app/models/type";

const sortOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("asc"); // Default selected sort
  const [selectedBrand, setSelectedBrand] = useState("All"); // Default selected brand
  const [selectedType, setSelectedType] = useState("All"); // Default selected type
  const [selectedBrandId, setSelectedBrandId] = useState(0); // Default selected brand ID
  const [selectedTypeId, setSelectedTypeId] = useState(0); // Default selected type ID

  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 10; // Number of items per page

  useEffect(() => {
    Promise.all([
      agent.Store.list(currentPage, pageSize),
      agent.Store.brands(),
      agent.Store.types()
    ])
      .then(([productsRes, brandsRes, typesRes]) => {
        setProducts(productsRes.content);
        setTotalItems(productsRes.totalElements);
        setBrands(brandsRes);
        setTypes(typesRes);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [currentPage, pageSize]);
  

  const loadProducts = (selectedSort, searchKeyword = '') => {
    setLoading(true);
    let page = currentPage - 1; // Adjusting page numbering to start from 0
    let size = pageSize;
    let brandId = selectedBrandId !== 0 ? selectedBrandId : undefined;
    let typeId = selectedTypeId !== 0 ? selectedTypeId : undefined;
    const sort = "name"; // Always sort by the name field
    const order = selectedSort === "desc" ? "desc" : "asc"; // Determine the order based on user selection

    // Construct the base URL with sorting parameters
    let url = `${agent.Store.apiUrl}?sort=${sort}&order=${order}`;

    // Check if brandId or typeId is selected to add filtering parameters to the URL
    if (brandId !== undefined || typeId !== undefined) {
      url += `&`;
      if (brandId !== undefined) url += `brandId=${brandId}&`;
      if (typeId !== undefined) url += `typeId=${typeId}&`;
      // Remove trailing "&" if present
      url = url.replace(/&$/, "");
    }

    // Make the API request with the constructed URL
    if (searchKeyword) {
      console.log(searchKeyword);
      // If search keyword is provided, perform search
      agent.Store.search(searchKeyword)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotalItems(productsRes.length);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    } else {
      // If no search keyword, proceed with regular list request
      agent.Store.list(page, size, undefined, undefined, url)
        .then((productsRes) => {
          setProducts(productsRes.content);
          setTotalItems(productsRes.totalElements);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    }
};


  // Trigger loadProducts whenever selectedBrandId or selectedTypeId changes
  useEffect(() => {
    loadProducts(selectedSort);
  }, [selectedBrandId, selectedTypeId]);
  
  
  const handleSortChange = (event) => {
    const selectedSort = event.target.value;
    setSelectedSort(selectedSort); // Update selectedSort state with the new sorting option
    loadProducts(selectedSort); // Reload products with the new sorting option
  };
  

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    const brand = brands.find((b) => b.name === selectedBrand);
    setSelectedBrand(selectedBrand);
    setSelectedBrandId(brand.id); // Set selected brand ID
    //setSearchTerm(selectedBrand); // Update searchTerm to trigger search
    loadProducts(selectedSort); // Call loadProducts to perform the search
  };
  
  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    const type = types.find((t) => t.name === selectedType);
    setSelectedType(selectedType);
    setSelectedTypeId(type.id); // Set selected type ID
    //setSearchTerm(selectedType); // Update searchTerm to trigger search
    loadProducts(selectedSort); // Call loadProducts to perform the search
  };
  

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) return <Spinner message="Loading Products..." />;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box mb={2} textAlign="center">
          <Typography variant="subtitle1">
            Displaying {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </Typography>
        </Box>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(totalItems / pageSize)} color="primary" onChange={handlePageChange} page={currentPage} />
        </Box>
      </Grid>
      <Grid item xs={3}>
      <Paper sx={{ mb: 2 }}>
        <TextField 
          label="Search products" 
          variant="outlined" 
          fullWidth 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Trigger search action
              loadProducts(selectedSort, searchTerm); // Pass the search term to loadProducts
            }
          }}
        />
    </Paper>

        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="sort-by-name-label">Sort by Name</FormLabel>
            <RadioGroup
              aria-label="sort-by-name"
              name="sort-by-name"
              value={selectedSort}
              onChange={handleSortChange}
            >
              {sortOptions.map(({ value, label }) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="brands-label">Brands</FormLabel>
            <RadioGroup
              aria-label="brands"
              name="brands"
              value={selectedBrand}
              onChange={handleBrandChange}
            >
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand.id}
                  value={brand.name}
                  control={<Radio />}
                  label={brand.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <FormControl>
            <FormLabel id="types-label">Types</FormLabel>
            <RadioGroup
              aria-label="types"
              name="types"
              value={selectedType}
              onChange={handleTypeChange}
            >
              {types.map((type) => (
                <FormControlLabel
                  key={type.id}
                  value={type.name}
                  control={<Radio />}
                  label={type.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={12}>
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination count={Math.ceil(totalItems / pageSize)} color="primary" onChange={handlePageChange} page={currentPage} />
        </Box>
      </Grid>
    </Grid>
  );
}
