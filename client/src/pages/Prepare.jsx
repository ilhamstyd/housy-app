import { Button, Card, Container } from "react-bootstrap";
import { API, setAuthToken } from "../config/api";
import { useQuery, useMutation } from "react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import qr from "../assets/qr-code-1.png"
import { Rupiah } from "../components/FormatIdr";
import icon from "../assets/navbrand.png"

export const History = () => {

  setAuthToken(localStorage.token);

  let { data: transactions } = useQuery("transactioneCaches", async () => {
    const response = await API.get(`/transaction-client`);
    console.log("mytbookingpending", response.data.data);
    return response.data.data;
  });

  const successTransactions = transactions?.filter(
    (transaction) => transaction.status === "success"
  );
  return (
    <div>
      <Container className="rounded-none">
        <h3 className="fw-semibold text-center">MY HISTORY BOOKING</h3>
        {successTransactions?.map((transaction, index) => (
          <Card key={index}
            style={{ width: "1035px", height: "350px", marginTop:"50px" }}
          >
            <div className="mt-3">
              <img src={icon} alt="Rectangle" />
            </div>
            <div
              className="position-absolute text-end"
              style={{ marginLeft: "820px" }}
            >
              <h3 className="fw-bold">Booking</h3>
              <p className=" fw-semibold text-secondary">
                sabtu, 21 Februari 2022
              </p>
              {transaction?.status === "success" ? (
                  <>
                    <img className="" src={qr} alt="" />
                    <p className="mt-3">INV0101</p>
                  </>
                ) : (
                  <p></p>
                )}
            </div>

            <div className="d-flex">
              <div>
                <h2 className="ms-2 fw-bold">{transaction?.house.name}</h2>
                <p className="ms-2">{transaction?.house.address}</p>

                {transaction?.status === "pending" ? (
              <div
              className="font-size-14px text-center rounded ms-5 mt-3"
              style={{
                width: "69px",
                height: "24px",
                color: "#FF9900",
                backgroundColor: "rgba(255,153,0,0.125)",
              }}
            >
              <p>{transaction?.status}</p>
            </div>                
              ):(
                <div
                  className="font-size-14px text-center rounded ms-5 mt-3"
                  style={{
                    width: "69px",
                    height: "24px",
                    color: "green",
                    backgroundColor: "rgba(255,153,0,0.125)",
                  }}
                >
                  <p>{transaction?.status}</p>
                </div>
              )}
                
              </div>
              <div style={{ marginLeft: "200px" }}>
                <div
                  className="rounded-circle"
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid black",
                  }}
                ></div>
                <div
                  className="ms-2 mt-2 border-start border-2"
                  style={{ width: "0px", height: "50px" }}
                ></div>
                <div
                  className="rounded-circle"
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "black",
                  }}
                ></div>
              </div>
              <div className="ms-3">
                <div>
                  <h5 className="fw-bold">Check In</h5>
                  <h5 className="text-secondary">{transaction?.check_in}</h5>
                </div>
                <div className="mt-4">
                  <h5 className="fw-bold">Check Out</h5>
                  <h5 className="text-secondary">{transaction?.check_out}</h5>
                </div>
              </div>
              <div className="ms-5">
                <div>
                  <h5 className="fw-bold">Amenities</h5>
                  {transaction?.house?.amenities?.map((amenity, idx) => (
                <h5 key={idx} className="text-secondary">
                {amenity},
                </h5>
                  ))}
                </div>
                <div className="mt-1">
                  <h5 className="fw-bold">Type Of Rent</h5>
                  <h5 className="text-secondary">{transaction?.house.type_rent}</h5>
                </div>
              </div>
            </div>

            <div className="row">
              <p className="col col-sm-3">No. Tanda Pengenal</p>
              <p className="col col-sm-2">Nama Pemesan</p>
              <p className="col col-sm-2">No. Handphone</p>
              <p className="col col-sm-3">Email</p>
              <p className="col col-sm-2"></p>
              <hr />
            </div>

            <div className="row text-secondary">
              <p className="col col-sm-3">{transaction?.user.id}</p>
              <p className="col col-sm-2">{transaction?.user.fullname}</p>
              <p className="col col-sm-2">{transaction?.user.phone}</p>
              <p className="col col-sm-3">{transaction?.user.email}</p>
              <p className="col col-sm-2 text-black text-center fw-bold">
              Long Time Rent : {transaction?.total_duration} {transaction?.house.type_rent} 
              </p>
            </div>
            <div className="col-12 text-end mb-5">
              {transaction.status === "pending" ? (
              <h5 className="text-danger">Total : {Rupiah(transaction?.price)}</h5>                
              ):(
                <h5 className="text-success">Total : {Rupiah(transaction?.price)}</h5>
              )}
            </div>
          </Card>
        ))}
      </Container>
    </div>
  );
};
