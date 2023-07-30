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
import { History } from "./pages/Prepare";
import { useQuery } from "react-query";
import { MyBookingPending } from "./pages/MyBookingPending";

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

//filter this

    //filter
    const [search, setSearch] = useState("")
    const [TypeRent, setTypeRent] = useState(null);
    const [Bedroom, setBedroom] = useState(null);
    const [Bathroom, setBathroom] = useState(null);
    const [Price, setPrice] = useState("");
    const [House, setHouse] = useState([]);
    console.log("ini type filter", TypeRent)
    console.log("ini Bedroom filter", Bedroom)
    console.log("ini Bathroom filter",Bathroom)
    console.log("ini maxprice filter", Price)
    console.log("ini search filter", search)
    
    let { data: Housefilter, refetch: HouseRefecth } = useQuery("HouseHomeCache", async () => {
    const response = search !== "" && TypeRent !== null && Bedroom !== null && Bathroom !== null && Price !== null ? (
        await API.get(`/house?city_name=${search}&type_rent=${TypeRent}&bedroom=${Bedroom}&bathroom=${Bathroom}&price=${Price}`)
    ) : search !== "" && TypeRent === null ? (
        await API.get(`filtercity?city_name=${search}`)
    ) : search === "" && TypeRent !== null && Bedroom !== null && Bathroom !== null && Price !== null ? (
        await API.get(`filterside?type_rent=${TypeRent}&bathroom=${Bathroom}&bedroom=${Bedroom}&price=${Price}`)
    ) :(await API.get(`/houses`))
    
    console.log(response.data.data);
    return response.data.data;
    });

    useEffect(() => {
      setHouse(Housefilter)
  },[Housefilter])

  return (
    <div className="app">
    <NavigationBar search={search} refetch={HouseRefecth} setSearch={setSearch}/>
    <Routes>
      <Route path="/" element={<Home Price={Price} Bedroom={Bedroom} Bathroom={Bathroom} setSearch={setSearch} data={House} refetch={HouseRefecth} typeRent={TypeRent} setTypeRent={setTypeRent} setBedroom={setBedroom} setBathroom={setBathroom} setPrice={setPrice} />} />
      <Route path="/detail-property/:id" element={<DetailProperty/>} />     
      <Route path="/list-transaction" element={<ListTransaction/>} />     
      <Route path="/profile" element={<Profile/>} />     
      <Route path="/add-property" element={<AddProperty/>} />     
      <Route path="/my-booking/:id" element={<MyBookingPending/>} />     
      <Route path="/my-booking" element={<MyBooking/>} />     
      <Route path="/history" element={<History/>} />     
    </Routes>
    </div>
  );
}

export default App;
