import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { API, setAuthToken } from "../config/api";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

export default function MdLCheckIn(props) {
  const navigate = useNavigate();

  const { id } = useParams();
  const houseId = parseInt(id, 10);
  

  const [form, setForm] = useState({
    check_in: "",
    check_out: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  setAuthToken(localStorage.token);

  const HandleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      const checkInDate = new Date(form.check_in);
      const checkOutDate = new Date(form.check_out);
      const totalDurations = new Date(checkOutDate) - new Date(checkInDate);

      // Mengubah total durasi 
      let totalDurationTypes = null

      
      if (props.type_rent === "Day") {
        totalDurationTypes = Math.ceil(totalDurations / (1000 * 3600 * 24));
      } else if (props.type_rent === "Month") {
        totalDurationTypes = Math.ceil(totalDurations / (1000 * 3600 * 24 * 30)); 
      } else if (props.type_rent === "Year") {
        totalDurationTypes = Math.ceil(totalDurations / (1000 * 3600 * 24 * 30 * 12)); 
      }

      let price = props.price*totalDurationTypes

      const formData = new FormData();
      formData.set("check_in", form.check_in);
      formData.set("check_out", form.check_out);
      formData.set("house_id", houseId );
      formData.set("total_duration", totalDurationTypes);
      formData.set("price", price);

      const response = await API.post("/transaction", formData).catch(
        (error) => {
          console.log("error", error);
          throw error;
        }
      );
      console.log("add transaction", response.data.data);

      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Berhasil Menambahkan Transaction Baru!",
          showConfirmButton: true,
          timer: 1500,
        });
        setForm({
          check_in: "",
          check_out: "",
        });
        navigate(`/my-booking/${response.data.data.id}`)
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Gagal Menambahkan Transaction Baru!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
    props.onHide()
  });

  return (
    <>
      <Modal show={props.show} onHide={props.setShow} centered>
        <div className="px-5 pb-3">
          <p
            className="fs-3 fw-bold text-center"
            style={{ color: "black", paddingTop: 45 }}
          >
            HOW LONG YOU WILL STAY
          </p>
          {/* {message && message} */}
          <Form onSubmit={HandleSubmit.mutate} className="mt-4">
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
              <Form.Label>Check In</Form.Label>
              <Form.Control
                className="p-2 mb-3"
                type="date"
                name="check_in"
                onChange={handleChange}
                placeholder="Check In"
                style={{
                  textColor: "#B1B1B1",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #B1B1B1",
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
              <Form.Label>Check Out</Form.Label>
              <Form.Control
                className="p-2 mb-3"
                type="date"
                name="check_out"
                onChange={handleChange}
                placeholder="Check Out"
                style={{
                  textColor: "#B1B1B1",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #B1B1B1",
                }}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn btn-dark fw-bold w-100 py-2 mt-3"
              style={{ borderRadius: "50px" }}
              // onClick={(e) => {HandleSubmit.mutate(e)}}
            >
              Save
            </Button>
          </Form>
        </div>
      </Modal>
    </>
  );
}
