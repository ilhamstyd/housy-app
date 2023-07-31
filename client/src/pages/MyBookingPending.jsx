import { Button, Card, Container } from "react-bootstrap";
import { API, setAuthToken } from "../config/api";
import { useQuery, useMutation } from "react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Rupiah } from "../components/FormatIdr";

export const MyBookingPending = () => {
  const i = useParams();

  setAuthToken(localStorage.token);

  let { data: transactions } = useQuery("transactionIDCache", async () => {
    const response = await API.get(`/transaction/${i.id}`);
    console.log("mytbookingpending", response.data.data);
    return response.data.data;
  });
  
  const Navigate = useNavigate()

  const handleBuy = useMutation (async () => {
    try {

      const response = await API.get(`/getpayment/${i.id}`);
      console.log("ini response mitrans", response);
      
      const token = response.data.data.token;
      console.log("ini token", token)

      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log(result);
          Navigate("/my-booking");
        },
        onPending: function (result) {
          console.log(result);
          Navigate("/my-booking");
        },
        onError: function (result) {
          console.log(result);
          Navigate("/my-booking");
        },
        onClose: function () {
          alert("DONE ")
        },
      });
    } catch (error) {
      console.log(error)
    }
  })

  useEffect (() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;

    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div>
      <Container className="mt-2 rounded-none shadow-none border-0 ml-20 me-3">
        <h3 className="fw-semibold text-center">MY BOOKING</h3>
        <Card className="ms-5"
          style={{ width: "1035px", height: "344px", marginTop: "20px" }}
        >
          <div className="mt-3">
            <img src="/images/Icon.png" alt="Rectangle" />
          </div>
          <div
            className="position-absolute text-end"
            style={{ marginLeft: "820px" }}
          >
            <h3 className="fw-bold">Booking</h3>
            <p className=" fw-semibold text-secondary">
              sabtu, 21 Februari 2022
            </p>
            {/* <img className=" mt-3" src="/images/Icon.png" alt="" />
  <p className="mt-3">INV0101</p> */}
          </div>

          <div className="d-flex">
            <div>
              <h2 className="ms-2 fw-bold">{transactions?.house.name}</h2>
              <p className="ms-2">{transactions?.house.address}</p>

              <div
                className="font-size-14px text-center rounded ms-5 mt-3"
                style={{
                  width: "69px",
                  height: "24px",
                  color: "#FF9900",
                  backgroundColor: "rgba(255,153,0,0.125)",
                }}
              >
                <p>{transactions?.status}</p>
              </div>
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
                className="rounded-circle mt-3"
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
                <h5 className="text-secondary">{transactions?.check_in}</h5>
              </div>
              <div className="mt-4">
                <h5 className="fw-bold">Check Out</h5>
                <h5 className="text-secondary">{transactions?.check_out}</h5>
              </div>
            </div>
            <div className="ms-5 mt-1">
              <div>
                <h5 className="fw-bold">Amenities</h5>
                  {transactions?.house.amenities?.map((amenity, idx) => (
                <span key={idx} className="text-secondary h5">
                    {amenity},
                </span>
                  ))}
              </div>
              <div className="mt-4">
                <h5 className="fw-bold">Type Of Rent</h5>
                <h5 className="text-secondary">
                  {transactions?.house.type_rent}
                </h5>
              </div>
            </div>
          </div>

          <div className="row">
            <p className="col col-sm-2">No. Tanda Pengenal</p>
            <p className="col col-sm-2">Nama Pemesan</p>
            <p className="col col-sm-2">No. Handphone</p>
            <p className="col col-sm-3">Email</p>
            <p className="col col-sm-3"></p>
            <hr />
          </div>

          <div className="row text-secondary">
            <p className="col col-sm-2">{transactions?.user.id}</p>
            <p className="col col-sm-2">{transactions?.user.fullname}</p>
            <p className="col col-sm-2">{transactions?.user.phone}</p>
            <p className="col col-sm-3">{transactions?.user.email}</p>
            <p className="col text-black col-sm-3 text-center fw-bold">
              Long Time Rent : {transactions?.total_duration} {transactions?.house.type_rent}
            </p>
          </div>
          <div
            className="mt-2"
            style={{ marginLeft: "830px" }}
          >
            <h5>Total : {Rupiah(transactions?.price)}</h5>
            <Button
            onClick={() => handleBuy.mutate(i.id)}
            className="btn btn-dark">PAY NOW</Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};
