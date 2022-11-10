import React from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col, Container } from "react-bootstrap";

function Clerk(props) {


  return (
    <>
          <h1 className="below-nav main-content text-center">Clerk Panel</h1>

          <Container fluid className = "text-center">
            
            <h3>Restock Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/acceptRO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Accept a restock order </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/stockRO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Stock a restock order </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />

          </Container>

    </>
  );
}

export default Clerk;