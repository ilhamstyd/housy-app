import detailHouse_1 from "../assets/detailHouse_1.png";
import detailHouse_2 from "../assets/detailHouse_2.png";
import detailHouse_3 from "../assets/detailHouse_3.png";
import detailHouse_4 from "../assets/detailHouse_4.png";
import bath_1 from "../assets/bath_1.png"
import bed_1 from "../assets/bed_1.png"
import { useState } from "react";
import MdLCheckIn from "../components/MdLCheckIn";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";

export const DetailProperty = () => {

  const Navigate = useNavigate()
  const { id } = useParams();

  let { data: house } = useQuery("houseCache", async () => {
    const response = await API.get("/house/" + id);
    return response.data.data;
  });

  const [showCheckIn, setShowCheckIn] = useState(false);
  const handleCloseCheckIn = () => {
      setShowCheckIn(false);
    };

  return (
    <>
      <div className="container">
        <div className="row text-center mt-5">
          <div className="">
            <img src={house?.image} alt="" className="col-9" />
          </div>
        </div>

        <div className="row">
          <div className="text-center" style={{ position: "relative" }}>
            <img src={house?.image} alt="" className="col-3" />
            <img src={house?.image} alt="" className="col-3" />
            <img src={detailHouse_4} alt="" className="col-3" />
            <p
              style={{
                position: "absolute",
                top: "75px",
                left: "955px",
                fontSize: "30px",
                color: "white",
              }}
            >+5
            </p>
          </div>
        </div>
        <div className="text-star" style={{ marginLeft: "160px" }}>
          <h1 className="mt-3">House Astine</h1>
          <div className="d-flex">
            <h4>RP. {house?.price} / {house?.type_rent}</h4>
            <h5 style={{ marginLeft: "510px" }}>{house?.bedroom} beds
            <img src={bed_1} className="ms-2"/></h5>
            <h5 style={{ marginLeft: "10px" }}>{house?.bathroom} bath
            <img src={bath_1} className="ms-2"/></h5>
            <h5 style={{ marginLeft: "10px" }}>1.800 ft</h5>
          </div>
          <h5 className="mt-3">Description</h5>
          <p style={{maxWidth:"810px"}}>{house?.description}</p>
          <div className="text-end" style={{marginRight:"150px"}}>
          <button className="btn btn-dark" onClick={() => {setShowCheckIn(true);}}>BOOK NOW</button>
          <div style={{height:"100px"}}></div>
          </div>
        </div>
      </div>
      <MdLCheckIn show={showCheckIn} setShow={setShowCheckIn} onHide={handleCloseCheckIn} price={house?.price} type_rent={house?.type_rent}/>
    </>
  );
};
