import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getBasketFromLocalStorage } from "../util/util";
import agent from "../api/agent";
import Spinner from "./Spinner";
import { useStoreContext } from "../context/StoreContext";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const {setBasket} = useStoreContext();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const basket = getBasketFromLocalStorage();
    if(basket){
      agent.Basket.get()
     // .then(basket=>agent.Basket.setBasket(basket))
      .then(basket=>setBasket(basket))
      .catch(error=>console.log(error))
      .finally(()=> setLoading(false))
    }else{
      setLoading(false);
    }
  }, [setBasket])
  const theme = createTheme({
    palette:{
      mode: paletteType,
      // background:{
      //   default: '#eaeaea'
      // }
    }
  })
  function handleThemeChange(){
    setDarkMode(!darkMode);
  }

  if(loading) return <Spinner message="Getting Basket ..."/>
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline/>
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet />      
      </Container>
      
    </ThemeProvider>
  );
}

export default App;


