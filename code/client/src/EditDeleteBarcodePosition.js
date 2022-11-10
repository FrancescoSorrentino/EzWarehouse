import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function EditDeleteBarcodePosition (props){
    const [validated, setValidated] = useState(false);
    const [barcode, setBarcode] = useState(props.positions && props.positions.length>0 ? (props.positions[0].barcode):(""));
    const [oldBarcode, setOldBarcode] = useState(props.positions && props.positions.length>0 ? (props.positions[0].barcode):(""));
    const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            if(props.delete){
                props.deletePosition(barcode);
                setBarcode("");
            }
            else{
            props.editPositionBarcode(oldBarcode,barcode);
                setBarcode("");
                setOldBarcode("");
            }
            
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT POSITION */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What position you want to modify or delete?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Position</Form.Label>
                    <Form.Select
                      id="selectPosition"
                      onChange={(e) => {
                          setOldBarcode(e.target.value)
                          setBarcode(e.target.value)}}
                    >
                      <option>
                        Select Position
                      </option>
                      {props.positions.length > 0 ? (
                        props.positions.map((p) => (
                          <option value={p.positionID}>
                            {p.positionID}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Col>
            </Modal.Body>
            <Modal.Footer>
            <Link to="/login"> 
                    <Button variant="secondary" className="m-3 ml-2 md-1 "> Back to your page </Button> 
              </Link>
              <Button variant="warning" id="submitButton" disabled={props.positions && (props.positions.length <= 0)} onClick={() => { setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.delete?("Delete"):("Edit")} Position </h2>
                </Row>
                {!props.delete &&<>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group >
                            <Form.Label>Old Barcode:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="oldBarcodeField"
                                disabled={true}
                                value={oldBarcode}
                                required
                               />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid barcode.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                </>}
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>{props.delete ? (""):("New")}Barcode:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="barcodeField"
                                disabled={props.delete}
                                value={barcode}
                                required
                                onChange={ev => setBarcode(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid barcode.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant={props.delete ?("danger"):("warning")} color="black" id="submitButton" type="submit" className="float-right ">{props.delete ?("Delete"):("Edit")} Position</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default EditDeleteBarcodePosition;