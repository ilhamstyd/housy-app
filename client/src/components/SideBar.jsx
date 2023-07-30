import Offcanvas from "react-bootstrap/Offcanvas";
import { Button, Form, InputGroup, ToggleButton, ToggleButtonGroup, } from "react-bootstrap";

export const SideBar = (props) => {
  return (
    <>
      <Offcanvas show={props.show} onHide={props.onHide}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>SEARCH PROPERTY</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <div className="mb-4">
              <div
                className="mb-2"
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                Type of Rent
              </div>
              <Form.Group className="d-flex flex-column gap-3">
                <ToggleButtonGroup
                  type="radio"
                  name="type_rent"
                  className="d-flex gap-3"
                >
                  <ToggleButton
                    variant="outline-secondary"
                    name="type_rent"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="Day"
                    value="Day"
                  >
                    Day
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="type_rent"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="Month"
                    value="Month"
                  >
                    Month
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="type_rent"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="Year"
                    value="Year"
                  >
                    Year
                  </ToggleButton>
                </ToggleButtonGroup>
              </Form.Group>
            </div>
            <div className="mb-4">
              <div
                className="mb-2"
                style={{
                  color: "black",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                Property Room
              </div>
              <div className="mb-2">
                <div
                  style={{
                    color: "#929292",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Bedroom
                </div>
                <ToggleButtonGroup
                  type="radio"
                  name="bedroom"
                  className="d-flex gap-3"
                >
                  <ToggleButton
                    variant="outline-secondary"
                    name="bedroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bedroom-1"
                    value="1"
                  >
                    1
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bedroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bedroom-2"
                    value="2"
                  >
                    2
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bedroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bedroom-3"
                    value="3"
                  >
                    3
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bedroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bedroom-4"
                    value="4"
                  >
                    4
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bedroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bedroom-5"
                    value="5"
                  >
                    5+
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
              <div className="mb-2">
                <div
                  style={{
                    color: "#929292",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  Bathroom
                </div>
                <ToggleButtonGroup
                  type="radio"
                  name="bathroom"
                  className="d-flex gap-3"
                >
                  <ToggleButton
                    variant="outline-secondary"
                    name="bathroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bathroom-1"
                    value={1}
                  >
                    1
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bathroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bathroom-2"
                    value={2}
                  >
                    2
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bathroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bathroom-3"
                    value={3}
                  >
                    3
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bathroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bathroom-4"
                    value={4}
                  >
                    4
                  </ToggleButton>
                  <ToggleButton
                    variant="outline-secondary"
                    name="bathroom"
                    className="fw-semibold text-dark bd rounded-2 bg w-100"
                    id="bathroom-5"
                    value={5}
                  >
                    5+
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
            <div className="mb-4">
              <div
                className="mb-2"
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                Amenities
              </div>
              <InputGroup className="d-flex justify-content-between">
                <Form.Label
                  htmlFor="furnishedCheckbox"
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#929292",
                  }}
                >
                  Furnished
                </Form.Label>
                <Form.Check
                  id="furnishedCheckbox"
                  aria-label="option 1"
                  name="Furnished"
                  value="furnished"
                />
              </InputGroup>
              <InputGroup className="d-flex justify-content-between">
                <Form.Label
                  htmlFor="petallowed"
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#929292",
                  }}
                >
                  Pet Allowed
                </Form.Label>
                <Form.Check
                  id="petallowed"
                  aria-label="option 1"
                  name="Pet Allowed"
                  value="Pet Allowed"
                />
              </InputGroup>
              <InputGroup className="d-flex justify-content-between">
                <Form.Label
                  htmlFor="sharedaccomodation"
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#929292",
                  }}
                >
                  Shared Accomodation
                </Form.Label>
                <Form.Check
                  id="sharedaccomodation"
                  aria-label="option 1"
                  name="Shared Accomodation"
                  value="Shared Accomodation"
                />
              </InputGroup>
            </div>
            <div className="mb-5">
              <div
                className="mb-2"
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "800",
                }}
              >
                Budget
              </div>
              <Form.Group className="d-flex justify-content-between align-items-center mb-3">
                <Form.Label
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Less than IDR.
                </Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  className="w-50"
                  placeholder="8.000.000"
                />
              </Form.Group>
            </div>
            <div className="d-flex justify-content-end">
              <Button
                variant="dark"
                type="submit"
                style={{ width: "140px", height: "50px" }}
              >
                APPLY
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
