import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { toast } from "react-toastify";

function NewUserForm(props) {
    const [validated, setValidated] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("customer");
    const regex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const types = ['customer','qualityEmployee','clerk','deliveryEmployee','supplier'];
    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();

        } else {
            const newUser = {
                username: email,
                name: name,
                surname: surname,
                password: password,
                type: type

            };

            props.addUser(newUser);
            setName(""); 
            setSurname(""); 
            setEmail(""); 
            setPassword("");
            setType("customer"); 
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration  " >

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <br />
                <Row className="justify-content-center text-center">
                    <h2> New User </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="nameField"
                                value={name}
                                required
                                onChange={ev => setName(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a name.
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
                            <Form.Label>Surname:</Form.Label>
                            <Form.Control
                                type='text'
                                id="surnameField"
                                value={surname}
                                required
                                onChange={ev => setSurname(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a surname.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group size="lg" controlId="email">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                id="emailField"
                                value={email}
                                required
                                onChange={ev => setEmail(ev.target.value)} />
                            {email.length === 0 && <Form.Control.Feedback type="invalid">
                                Please insert an email address.
                            </Form.Control.Feedback>}
                            {regex.test(email) === false && email.length > 0 &&
                                <Form.Control.Feedback type="invalid">
                                    Please insert an email address. '@' must be included.
                                </Form.Control.Feedback>
                            }
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group controlId='password'>
                            <Form.Label>Password:</Form.Label>
                            <Form.Control
                                type='password'
                                id="pswField"
                                value={password}
                                required
                                onChange={ev => setPassword(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a password.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                { props.manager && <>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>User Type:</Form.Label>
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
                </>}
                <Row>
                    <Col md={6} xs={6}/>
                    <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setName(""); setSurname(""); setEmail(""); setPassword(""); setType("customer"); setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>
                    <Col md={2} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Create new user</Button>
                    </Col>
                    <Col md={2} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewUserForm;