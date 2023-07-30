import {Button, Modal, Form} from "react-bootstrap"
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API, setAuthToken } from "../config/api";
import Swal from "sweetalert2";
import { useState } from "react";


export const ModalChangePassword = (props) => {

  const navigate = useNavigate();
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handlerPassword = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  setAuthToken(localStorage.token);
  const HandleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.patch("/change-password", password);
      console.log("Success Change Password", response.data);

      if (password.new_password !== password.confirm_password) {
        return Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Oops...",
          text: "New password and confirmation do not match",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Success",
        text: "You have successfully change password",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/profile");
      props.onHide()
    } catch (error) {
      console.log("error ganti password", error)
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Oopssssss...",
        text: "Failed to change the password",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });

    return (
        <>
        <Modal show={props.show} onHide={props.setShow} centered>
          <div className="px-5 pb-3">
            <p className="fs-3 fw-bold text-center" style={{ color: "black", paddingTop: 45 }}>
            Change Password
            </p>

            <Form className="mt-4" onSubmit={HandleSubmit.mutate}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                <Form.Control
                  onChange={handlerPassword}
                  className="p-2 mb-3"
                  type="password"
                  name="old_password"
                  value={password.old_password}
                  placeholder="Old Password"
                  style={{
                    textColor: "#B1B1B1",
                    backgroundColor: "rgba(97, 61, 43, 0.25)",
                    border: "2px solid #B1B1B1",
                  }}
                  required
                  />
                  </Form.Group>
    
    
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                <Form.Control
                  className="p-2 mb-3"
                  type="password"
                  name="new_password"
                  onChange={handlerPassword}
                  value={password.new_password}
                  placeholder="New Password"
                  style={{
                    textColor: "#B1B1B1",
                    backgroundColor: "rgba(97, 61, 43, 0.25)",
                    border: "2px solid #B1B1B1",
                  }}
                    required
                />
                </Form.Group>
    
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
                <Form.Control
                  className="p-2 mb-3"
                  type="password"
                  name="confirm_password"
                  onChange={handlerPassword}
                  value={password.confirm_password}
                  placeholder="Confirm Password"
                  style={{
                    textColor: "#B1B1B1",
                    backgroundColor: "rgba(97, 61, 43, 0.25)",
                    border: "2px solid #B1B1B1",
                  }}
                    required
                />
                </Form.Group>
    
              <Button type="submit" className="btn btn-dark fw-bold w-100 py-2 mt-3" style={{ borderRadius: "50px" }}>
                Save
              </Button>
            </Form>
  
          </div>
        </Modal>
        </>
      );
}