import {Button, Card, Container, Image, Form } from "react-bootstrap"
import { Stack } from "react-bootstrap";
import phone from "../assets/phone.png";
import name from "../assets/name.png";
import password from "../assets/password.png";
import email from "../assets/email.png";
import ilham from "../assets/ilham.jpg";
import { useState } from "react";
import { ModalChangePassword } from "../components/ModalChangePassword";
import { API, setAuthToken } from "../config/api";
import { UserContext } from "../UserContext/UserContext";
import { useContext } from "react";
import { useQuery } from "react-query";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

export const Profile = () => {

  const [state] = useContext(UserContext);

    const [showSuccess, setShowsuccess] = useState(false);
    const handleCloseSuccess = () => {
        setShowsuccess(false);
      };

  setAuthToken(localStorage.token)

  const [photo, setPhoto] = useState({
    image: "",
  });
  const handleChangePhoto = (e) => {
    const { name, type } = e.target;
    setPhoto({
      ...photo,
      [name]: type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      console.log("data url", url);
    }
  };

  const handleUpdate = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (photo.image) {
        formData.set("image", photo?.image[0], photo?.image[0]?.name);
      }

      const response = await API.patch("/change-image" , formData);


      Swal.fire(
        {
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Success",
          text: "You have successfully change photo profile",
          showConfirmButton: false,
          timer: 1500,
        },
        response
      );
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Oops...",
        text: "Failed change photo profile",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });


    return (
        <div className="bg-light py-5">
          <Container className="d-flex justify-content-center">
            <Card className="w-75">
              <Card.Body className="d-flex justify-content-between p-4">
                <div className="d-flex flex-column gap-4">
                  <h4>Personal Info</h4>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Image src={name} />
                    </div>
                    <div>
                      <Card.Title>{state.user?.fullname}</Card.Title>
                      <Card.Text className="text-secondary">Full name</Card.Text>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Image src={email} />
                    </div>
                    <div>
                      <Card.Title>{state.user?.email}</Card.Title>
                      <Card.Text className="text-secondary">Email</Card.Text>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Image src={password} />
                    </div>
                    <div>
                      <Card.Title style={{cursor:"pointer"}} onClick={() => setShowsuccess(true)}>
                        <Card.Link
                          className="text-primary text-decoration-none"
                        >
                          Change Password
                        </Card.Link>

                      </Card.Title>
                      <Card.Text className="text-secondary">Password</Card.Text>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      <Image src={phone} />
                    </div>
                    <div>
                      <Card.Title>{state.user?.phone}</Card.Title>
                      <Card.Text className="text-secondary">Mobile phone</Card.Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img
                      variant="top"
                      style={{
                        maxWidth: "18rem",
                        minHeight: "18rem",
                        objectFit: "cover",
                      }}
                      src={state.user?.image}
                    />
                  </Card>
                  <Form onSubmit={handleUpdate.mutate}
                    className="mt-2 w-100"
                    style={{
                      maxWidth: "18rem",
                      objectFit: "cover",
                    }}
                  >
                    <Form.Group className="mb-5">
                      <Form.Control
                        type="file"
                        id="upload"
                        name="image"
                        onChange={handleChangePhoto}
                        required
                      />
                      <Button
                        className="btn btn-dark mt-2 w-100"
                        type="submit"
                        style={{
                          maxWidth: "18rem",
                          objectFit: "cover",
                        }}
                      >
                        Change Photo Profile
                      </Button>
                    </Form.Group>
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Container>
          <ModalChangePassword show={showSuccess} setShow={setShowsuccess} onHide={handleCloseSuccess}/>
        </div>
      );
};
