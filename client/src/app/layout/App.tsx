import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getBasketFromLocalStorage } from "../util/util";
import agent from "../api/agent";
import Spinner from "./Spinner";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const basket = getBasketFromLocalStorage();
    dispatch(fetchCurrentUser());
    if(basket){
      agent.Basket.get()
      .then(basket=>dispatch(setBasket(basket)))
      .catch(error=>console.log(error))
      .finally(()=> setLoading(false))
    }else{
      setLoading(false);
    }
  }, [dispatch])
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


