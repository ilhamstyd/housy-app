import {Button, Container, Form, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ModalLogin } from "./ModalLogin";
import { ModalRegister } from "./ModalRegister";
import { useState, useContext } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";
import profile from "../assets/blank-profile.png"
import Logout from "../assets/icon_logout.png"
import icon_user from "../assets/icon_user.png"
import cabin from "../assets/cabin_1.png"
import bill from "../assets/icon_bill.png"

function NavigationBar() {
  const Navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleShowLogin = () => {
    handleClose(true);
    setShowLogin(true);
  };

  const handleShowRegister = () => {
    handleClose(true);
    setShowRegister(true);
  };

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logout Success",
      showConfirmButton: false,
      timer: 1500,
    });
    Navigate("/");
    // window.location.reload();
  };
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Link to="/"><Navbar.Brand href="#">
            <img
              style={{ objectFit: "cover", height: "40px" }}
              src="/images/icon.png"
              alt=""
            />
          </Navbar.Brand></Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="my-2 my-lg-0"
              style={{ maxHeight: "100px", marginLeft: "400px" }}
              navbarScroll
              >
                <div>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  
                  />
                <Button variant="light" type="submit">
                  <img
                    src="/images/search 1.png"
                    style={{ objectFit: "cover", width: "25px" }}
                    />
                </Button>
                    </Form>
                    </div>
                    {state.isLogin === true? (state.user.role === "owner" ? (
                    <Nav style={{marginLeft:"400px"}}>
                    <h5
                      className="fw-bold "
                      style={{ color: "black", marginTop: "20px" }}
                    >{state.user.username}</h5>
                    <NavDropdown
                      align="end"
                      id="dropdown"
                      title={
                        <img
                          src={state.user.image}
                          alt=""
                          className="rounded-circle "
                          style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            width: "50px",
                            height: "50px",}}/>
                            }>
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={icon_user} alt="" />
                        <Link to="/profile"  className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">Profile</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={cabin} alt="" />
                        <Link to="/add-property" className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">Add Property</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={bill} alt="" />
                        <Link to="/my-ticket" className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">History</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                      <NavDropdown.Item
                        className="d-flex align-items-center"
                        onClick={logout}>
                        <img src={Logout} style={{ width: "40px" }} alt="" />
                        <span className="ms-3 fw-bold">Logout</span>
                      </NavDropdown.Item>
                      </NavDropdown> 
                  </Nav>
                    ):(
                      <Nav style={{marginLeft:"400px"}}>
                    <h5
                      className="fw-bold "
                      style={{ color: "black", marginTop: "20px" }}
                    >halo, {state.user.username}</h5>
                    <NavDropdown
                      align="end"
                      id="dropdown"
                      title={
                        <img src={state.user.image}
                          alt=""
                          className="rounded-circle "
                          style={{
                            cursor: "pointer",
                            objectFit: "cover",
                            width: "50px",
                            height: "50px",}}/>
                            }>
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={icon_user} alt="" />
                        <Link to="/profile" className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">Profile</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={bill} alt="" />
                        <Link to="/my-booking" className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">My Booking</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                        <NavDropdown.Item className="d-flex align-items-center">
                        <img src={cabin} alt="" />
                        <Link to="/my-booking" className='text-decoration-none text-dark'>
                          <span className="ms-3 fw-bold">History</span></Link>
                      </NavDropdown.Item>
                      <NavDropdown.Divider style={{ background: "#EC7AB7" }} />
                      <NavDropdown.Item
                        className="d-flex align-items-center"
                        onClick={logout}>
                        <img src={Logout} style={{ width: "40px" }} alt="" />
                        <span className="ms-3 fw-bold">Logout</span>
                      </NavDropdown.Item>
                      </NavDropdown> 
                  </Nav>
                    ) 
                    ) :(                
                    <div className="d-flex" style={{ marginLeft: "250px" }}>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={handleShowLogin}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark ms-3"
                    onClick={handleShowRegister}
                  >
                    Register
                  </button>
                </div>
                )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <ModalLogin
        show={showLogin}
        onHide={handleClose}
        onClick={handleShowRegister}
      />
      <ModalRegister
        show={showRegister}
        onHide={handleClose}
        onClick={handleShowLogin}
      />
    </>
  );
}

export default NavigationBar;