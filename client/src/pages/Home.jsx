import { useState } from "react";
import { Col, Row, Card, Button } from "react-bootstrap";
import { rupiahFormat } from "rupiah-format";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";
import { SideBar } from "../components/SideBar";

function Home() {
  const [showForm, setShowForm] = useState(false);
  const handleCloseForm = () => {
    setShowForm(false); 
  }

  let { data: houses } = useQuery("housesCache", async () => {
    const response = await API.get("/houses");
    console.log("ini respone house", response.data.data);
    return response.data.data;
  });

  return (
    <>
      <Button variant="dark" onClick={() => {setShowForm(true);}}> Find House </Button>
      {/* <Col md={7} lg={8} className="bg-light p-4 ms-auto"> */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {houses?.map((item, index) => (
          <Col className="" key={index}>
            <Link
              to={`/detail-property/` + item.id}
              className="text-decoration-none text-dark"
              style={{ cursor: "pointer" }}
            >
              <Card className="h-100 shadow border p-2 mb-2 border-opacity-10">
                <Card.Img
                  variant="top rounded"
                  src={item.image}
                  className="position-relative"
                />
                <div className="position-absolute d-flex gap-2 align-item-center p-1">
                  {item.amenities?.map((amenity, idx) => (
                    <div key={idx}>
                      <Card.Text
                        className="rounded bg-white py-1 px-2"
                        style={{ fontSize: "9px" }}
                      >
                        {amenity}
                      </Card.Text>
                    </div>
                  ))}
                </div>
                <Card.Body className="px-0">
                  <Card.Title className="fw-bold">RP. {item.price}</Card.Title>
                  <Card.Text className="fw-semibold mb-0">
                    {item.bedroom} beds, {item.bathroom} bath, 1.800 sqft{" "}
                  </Card.Text>
                  <Card.Text style={{ color: "#A8A8A8" }}>
                    {item.city_name}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
        <SideBar show={showForm} onHide={handleCloseForm}/>
      </Row>
    </>
  );
}

export default Home;
