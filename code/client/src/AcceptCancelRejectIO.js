import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useState } from 'react'
import './NewClientForm.css'

function AcceptCancelRejectIO (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.IOIssued && props.IOIssued.length > 0 ? (props.IOIssued[0].id):(0));
  const [show,setShow] = useState (true);
  const [accept, setAccept] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            if(props.manager && accept === false){

                props.editIO(id,{newState:"REFUSED"});
            }
            else if(props.manager && accept === true){
                props.editIO(id,{newState:"ACCEPTED"});
            }
            else{
                props.editIO(id,{newState:"CANCELED"});
            }
            
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT INTERNAL ORDER ISSUED */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Internal Order you want to see?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Internal Order</Form.Label>
                    <Form.Select
                      id="selectIO"
                      onChange={(e) => {setId(e.target.value)
                    }}
                    >
                      <option>
                        Select Internal Order
                      </option>
                      {props.IOIssued.length > 0 ? (
                        props.IOIssued.map((p) => (
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
              <Button variant="warning" id="submitButton" disabled={props.IOIssued && (props.IOIssued <= 0)} onClick={() => { 
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.manager?("Accept/Refuse"):("Cancel")} Internal Order </h2>
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
                {props.manager &&
                <>
                    <br />   
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>Accept Order?</Form.Label>
                            <Form.Check 
                                label={"Check to Accept Internal Order"}
                                value={accept}
                                onChange={()=>{
                                    setAccept((oldval)=>!oldval)}}
                            />                            
                        </Form.Group>
                        </Col>
                        <Col xs={2} />
                    </Row>
                </>
                }
                <br />
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant={accept?("success"):("danger")} color="black" id="submitButton" type="submit" className="float-right ">{props.manager?(accept?("Accept"):("Refuse")):("Cancel")} Internal Order </Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default AcceptCancelRejectIO;