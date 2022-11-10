import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";

function StockRO (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.RO && props.RO.length > 0 ? (props.RO[0].id):(0));
  const [restockOrder, setRestockOrder] = useState ({});
  
  const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            for(let item of restockOrder.skuItems){
               await props.stockItem(item.rfid);
            }
            
            const newState = "COMPLETED";
            props.editRO(id,{newState:newState},restockOrder);
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT RESTOCK ORDER TESTED */}
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
                                        const ident = e.target.value;
                                        for (let Ro of props.RO){
                                          if(ident*1 === Ro.id*1){
                                            setRestockOrder(Ro);
                                            break;
                                          }
                                        }
                    }}
                    >
                      <option>
                        Select Restock Order
                      </option>
                      {props.RO.length > 0 ? (
                        props.RO.map((p) => (
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
              <Button variant="warning" id="submitButton" disabled={props.RO && (props.RO <= 0)} onClick={() => { 
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Stock Restock Order </h2>
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
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Stock Restock Order </Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default StockRO;