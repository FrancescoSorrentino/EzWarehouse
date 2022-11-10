import React from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col, Container } from "react-bootstrap";

function Customer(props) {


  return (
    <>
          <h1 className="below-nav main-content text-center">Customer Panel</h1>

          <Container fluid className = "text-center">
            
            <h3>Internal Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createIO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Issue an internal order </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/cancelIO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Cancel an internal order </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />

          </Container>

    </>
  );
}

export default Customer;