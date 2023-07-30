import { Modal, Alert } from "react-bootstrap"

export const MdlConfirmation = (props) => {

    return(
        <Modal show={props.show} onHide={props.setShow}>
             <Modal.Body className=" m-auto p-0 w-100">
                    <div >
                        <Alert className="w-100 m-auto fs-2" style={{ textAlign: "center" }} variant="light">
                        <p>Pembayaran anda Akan dikonfirmasi dalam 1x24jam untuk melihat pesanan Klik {" "}</p>
                        <span className="fw-bold" style={{cursor: "pointer"}}>Disini</span>
                        </Alert>
                    </div>
                </Modal.Body>
        </Modal>
    )
}