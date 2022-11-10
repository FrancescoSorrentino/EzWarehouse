import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function EditDeleteUser (props){
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState(props.users && props.users.length>0 ? (props.users[0].email):(""));
    const [oldType, setOldType] = useState ("");
    const [type, setType] = useState ("customer");
    const [show,setShow] = useState (true);
    const types = ['customer','qualityEmployee','clerk','deliveryEmployee','supplier'];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            if(props.delete){
                props.deleteUser(username,oldType);
                setUsername("");

            }
            else{
            const newUser = {
              oldType: oldType,
              newType: type
            }
            props.editUser(username,newUser);
                setUsername("");
                
            }
            
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT USER */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What user you want to modify or delete?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select User</Form.Label>
                    <Form.Select
                      id="selectUser"
                      onChange={(e) => {
                          setUsername(e.target.value)
                          const usern=e.target.value;
                          for (let user of props.users){
                            if(user.email === usern){
                              setOldType(user.type)
                            }
                        }
                        }}
                    >
                      <option>
                        Select User
                      </option>
                      {props.users.length > 0 ? (
                        props.users.map((p) => (
                          <option value={p.email}>
                            {p.email}
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
              <Button variant="warning" id="submitButton" disabled={props.users && (props.users.length <= 0)} onClick={() => { 
                for (let user of props.users){
                  if(user.email === username){
                    setOldType(user.type)
                  }
              }
                setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.delete?("Delete"):("Edit")} User </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="emailField"
                                disabled={true}
                                value={username}
                                required
                               />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid email.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                {!props.delete &&<>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Old Type:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="oldTypeField"
                                disabled={true}
                                value={oldType}
                                required
                               />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid type.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>New Type:</Form.Label>
                            <Form.Select
                                id="selectType"
                                onChange={(e) => {setType(e.target.value)}}
                                defaultValue="customer"
                                >
                                {types.map((p) => (
                                    <option value={p}>
                                        {p}
                                    </option>
                                ))}
                                
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                </>}
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant={props.delete ?("danger"):("warning")} color="black" id="submitButton" type="submit" className="float-right ">{props.delete ?("Delete"):("Edit")} User</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default EditDeleteUser;