import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../config/api";
import { useMutation } from "react-query";
import Swal from "sweetalert2"
import { Button, Container, Form, Image } from "react-bootstrap";

export const AddProperty = () => {

  const Navigate = useNavigate()

  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: '',
    city_name: '',
    address: '',
    price: '',
    type_rent: '',
    amenities: [],
    bedroom: '',
    bathroom: '',
    area: '',
    image: '',
    description: '',
  });

  console.log(form);
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      let newAmenities = [...form.amenities];
      if (checked) {
        newAmenities.push(value);
      } else {
        newAmenities = newAmenities.filter((amen) => amen !== value);
      }
      setForm({ ...form, amenities: newAmenities });
    } else {
      setForm({
        ...form,
        [name]: type === "file" ? e.target.files : e.target.value,
      });
    }
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  
  const handleSubmit = useMutation(async (e) => {
    try {
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      e.preventDefault();

      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("city_name", form.city_name);
      formData.set("address", form.address);
      formData.set("price", form.price);
      formData.set("type_rent", form.type_rent);
      formData.set("type_rent", form.type_rent);
      formData.set("amenities", JSON.stringify(form.amenities));

      formData.set("bedroom", form.bedroom);
      formData.set("bathroom", form.bathroom);
      formData.set("area", form.area);
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("description", form.description);

      
      const response = await API.post("/house", formData, config)
      .catch((error) => {
        console.log("error", error);
        throw error;
      })
      console.log("add property", response)
      
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Berhasil Menambahkan Property Baru!",
          showConfirmButton: true,
          timer: 1500,
        });
        setForm({
          name: '',
          city_name: '',
          address: '',
          price: '',
          type_rent: '',
          amenities: [],
          bedroom: '',
          bathroom: '',
          area: '',
          image: '',
          description: '',
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Gagal Menambahkan Property Baru!",
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  });
  

  return (
    <div className="bg-light py-5">
      <Container>
        <h2 className="mb-4">Add Property</h2>
        <Form onSubmit={handleSubmit.mutate}>
          <Form.Group className="mb-3">
            <Form.Label>Name Property</Form.Label>
            <Form.Control
              type="text"
              name="name"
              onChange={handleChange}
              value={form.name}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">City</Form.Label>
            <Form.Select name="city_name" value={form.city_name} onChange={handleChange} required>
              <option hidden>-- Pilih --</option>
              <option value="Bali">Bali</option>
              <option value="Jakarta">Jakarta</option>
              <option value="yogyakarta">Yogyakarta</option>
              <option value="Maluku">Maluku</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Area</Form.Label>
            <Form.Control
              type="text"
              name="area"
              onChange={handleChange}
              value={form.area}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Address</Form.Label>
            <Form.Control
              rows={4}
              as="textarea"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Type of Rent</Form.Label>
            <Form.Select
              name="type_rent"
              onChange={handleChange}
              value={form.type_rent}
              required
            >
              <option hidden>-- Pilih --</option>
              <option value="Day">Day</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>

            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 d-flex flex-column" controlId="amenities">
            <Form.Label className="fw-bold">Amenities</Form.Label>
            <Form.Group className="d-flex gap-4">
              <Form.Check
                onChange={handleChange}
                checked={form.amenities.includes("Furnished")}
                type="checkbox"
                label="Furnished"
                name="Furnished"
              />
              <Form.Check
              onChange={handleChange}
              checked={form.amenities.includes("Pet Allowed")} // Ganti value dengan checked
                type="checkbox"
                label="Pet Allowed"
                name="Pet Allowed"
              />
              <Form.Check
              onChange={handleChange}
              checked={form.amenities.includes("Shared Accomodation")} // Ganti value dengan checked
                type="checkbox"
                label="Shared Accomodation"
                name="Shared Accomodation"
              />
            </Form.Group>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Bedroom</Form.Label>
            <Form.Select
              name="bedroom"
              value={form.bedroom}
              onChange={handleChange}
              required
            >
              <option hidden>-- Pilih --</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Bathroom</Form.Label>
            <Form.Select
              name="bathroom"
              value={form.bathroom}
              onChange={handleChange}
              required
            >
              <option hidden>-- Pilih --</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              rows={4}
              as="textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-bold">Photo House</Form.Label>
            <Form.Control
              type="file"
              onChange={handleChange}
              id="upload"
              name="image"
              accept="image/*"
              required
              multiple
            />
            {preview && (
              <Image
                src={preview}
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            )}
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex justify-content-center"
            controlId="button"
          >
            <Button
              variant="dark"
              type="submit"
              style={{ width: "300px", height: "50px" }}
            >
              Save
            </Button>
            
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
};
