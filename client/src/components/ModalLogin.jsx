import {Modal, Form, Button} from 'react-bootstrap'
import { useState, useContext } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "react-query";
import {API, setAuthToken} from "../config/api"
import Swal from "sweetalert2"

export const ModalLogin = (props) => {

  const Navigate = useNavigate()
  const [_, dispatch] = useContext(UserContext); 

  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });

  const { username, password} = formLogin;

  const OnChangeHandler = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      // Insert data for login process, you can also make this without any configuration, because axios would automatically handling it.
      const response = await API.post("/login", formLogin);

      console.log("login success : ", response.data.data);

      // Send data to useContext
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data
      });

      setAuthToken(response.data.data.token);

      // Status check
      if (response.data.data.role === "owner") {
        Navigate("/list-transaction");
      } else {
        Navigate("/");
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Login Berhasil",
        showConfirmButton: false,
        timer: 1500,
      });
      props.onHide()
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login Gagal",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log("login failed : ", error);
    }
  });

    return (
        <>
          <Modal show={props.show}
          onHide={props.onHide}>
              <Modal.Title className='text-center fs-3 fw-bold py-3'
              style={{ color:"black"}}>LOGIN</Modal.Title>
            <Modal.Body>
    -          <Form className='mt-4' onSubmit={(e) => handleSubmit.mutate(e)}>
                <Form.Group className="mb-3"
                controlId="exampleForm.ControlInput1">
                  <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={OnChangeHandler}
                    placeholder="Username"
                    className="p-2 mb-3"
                    style={{
                      textColor: "#B1B1B1",
                      backgroundColor: "rgba(97, 61, 43, 0.25)",
                      border: "2px solid #B1B1B1",
                    }}autoFocus/>
    
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1">
                  <Form.Control type='Password'
                  placeholder='Password'
                  name="password"
                  value={password}
                  onChange={OnChangeHandler}
                  style={{
                    textColor: "#B1B1B1",
                    backgroundColor: "rgba(97, 61, 43, 0.25)",
                    border: "2px solid #B1B1B1"}}/>
                  <Button type="submit"
                  className="btn btn-dark fw-bold border-0 w-100 py-2 mt-3"
                  style={{borderRadius: "50px"}}>
                  LOGIN
                 </Button>
                </Form.Group>
              </Form>
              <p className="text-center mt-3">
                Belum Punya Akun ? Klik{" "}
                <span onClick={props.onClick} className="fw-bold" style={{ cursor: "pointer" }}>
                  Disini
                </span>
              </p>
            </Modal.Body>
          </Modal>
        </>
      );
}