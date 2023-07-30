import "bootstrap/dist/css/bootstrap.min.css";
import {Routes, Route} from "react-router-dom"
import './App.css';
import Home from "./pages/Home";
import NavigationBar from "./components/Navbar";
import { DetailProperty } from "./pages/DetailProperty";
import { ListTransaction } from "./pages/ListTransaction";
import { Profile } from "./pages/Profile";
import { AddProperty } from "./pages/AddProperty";
import { MyBooking } from "./pages/MyBooking";
import { useNavigate } from "react-router-dom";
import { API, setAuthToken } from "./config/api";
import React, { useContext, useEffect,useState } from "react";
import { UserContext } from "./UserContext/UserContext";
import { Prepare } from "./pages/Prepare";

function App() {

  let navigate = useNavigate();
const [state, dispatch] = useContext(UserContext);
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  // Redirect Auth but just when isLoading is false
  if (!isLoading) {
    if (state.isLogin === false) {
      navigate('/');
    }
  }
}, [isLoading]);

useEffect(() => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    checkUser();
  } else {
    setIsLoading(false)
  }
}, []);

const checkUser = async () => {
  try {
    const response = await API.get('/check-auth');
    console.log("check user success : ", response)
    // Get user data
    let payload = response.data.data;
    // Get token from local storage
    payload.token = localStorage.token;
    // Send data to useContext
    dispatch({
      type: 'USER_SUCCESS',
      payload,
    });
    setIsLoading(false)
  } catch (error) {
    console.log("check user failed : ", error);
    dispatch({
      type: 'AUTH_ERROR',
    });
    setIsLoading(false)
  }
};

  return (
    <div className="app">
    <NavigationBar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/detail-property/:id" element={<DetailProperty/>} />     
      <Route path="/list-transaction" element={<ListTransaction/>} />     
      <Route path="/profile" element={<Profile/>} />     
      <Route path="/add-property" element={<AddProperty/>} />     
      <Route path="/my-booking/:id" element={<MyBooking/>} />     
      <Route path="/my-booking" element={<MyBooking/>} />     
      <Route path="/prepare" element={<Prepare/>} />     
    </Routes>
    </div>
  );
}

export default App;
