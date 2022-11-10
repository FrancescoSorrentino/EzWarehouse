import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";

function DeliverRO (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.ROIssued && props.ROIssued.length > 0 ? (props.ROIssued[0].id):(0));
  const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            props.editRO(id,{newState:"DELIVERY"});
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT RESTOCK ORDER ISSUED */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Restock Order you want to see?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Restock Order</Form.Label>
                    <Form.Select
                      id="selectRO"
                      onChange={(e) => {setId(e.target.value)
                    }}
                    >
                      <option>
                        Select Restock Order
                      </option>
                      {props.ROIssued.length > 0 ? (
                        props.ROIssued.map((p) => (
                          <option value={p.id}>
                            {p.id}
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
              <Button variant="warning" id="submitButton" disabled={props.ROIssued && (props.ROIssued <= 0)} onClick={() => { 
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Deliver Restock Order </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>Id:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='number'
                                id="idField"
                                disabled={true}
                                value={id}
                                required
                                />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid id.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Deliver Restock Order </Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default DeliverRO;