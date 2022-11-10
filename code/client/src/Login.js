import React, { useState } from "react";
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import './Login.css'

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("C")

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    props.handleSubmit({ username, password }, type)
  }

  return (
    <div className="Login below-nav main-content text-center">
      <h2>Login</h2><br />
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            id="emailField"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <br /> 
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            id="pswField"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <br />
        <Form.Group size="lg">
          <Form.Label>Type of user</Form.Label>
          <Form.Select defaultValue="C" id="userType" onChange={e => setType(e.target.value)}>
            <option value="C">Internal Customer</option>
            <option value="M">Manager</option>
            <option value="S">Supplier</option>
            <option value="K">Clerk</option>
            <option value="Q">Quality Employee</option>
            <option value="D">Delivery Employee</option>
          </Form.Select>
        </Form.Group>
        <br />
        <Form.Group size="lg">
        <Button variant="warning" block size="lg" id="submitLogin" type="submit" disabled={!validateForm()}>
          Login
        </Button>
        </Form.Group>
        <br />
        {/* 
        <Form.Group size="lg">
        <Link to="/register" style={{ color: 'white', textDecoration:'none'}}> 
          <Button variant="warning" block size="lg">
            Create a new account
          </Button>
        </Link>
        </Form.Group>*/}
        
        
      </Form>
    </div>
  );
}

function LogButton(props) {
  return (
    <Col>{props.loggedIn ? <>
      <Button variant="warning" onClick={props.logout}>Logout</Button>
    </> : <>
      <Link to="/login">
        <Button variant="warning">Login</Button>
      </Link>
    </>
    }</Col>
  );
}

function LoginButton(props) {
    return (
      <Col>
        <Link to="/login">
          <Button variant="warning">{props.loggedIn ?("Personal page"):("Login")}</Button>
        </Link>
      </Col>
    );
  }

export { Login, LogButton, LoginButton }