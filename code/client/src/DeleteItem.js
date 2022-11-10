import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function DeleteItem (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.items && props.items.length > 0 ? (props.items[0].id):(0));
  const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            
            props.deleteItem(id);
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT ITEM */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>Which Item you want to delete?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Item</Form.Label>
                    <Form.Select
                      id="selectItem"
                      onChange={(e) => {setId(e.target.value)
                    }}
                    >
                    <option>
                      Select Item
                    </option>
                      {props.items.length > 0 ? (
                        props.items.map((p) => (
                          <option value={p.id}>
                            {p.id} - {p.description}
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
              <Button variant="warning" id="submitButton" disabled={props.items && (props.items <= 0)} onClick={() => { 
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Delete Item </h2>
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
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="danger" color="black" id="submitButton" type="submit" className="float-right ">Delete Item</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default DeleteItem;