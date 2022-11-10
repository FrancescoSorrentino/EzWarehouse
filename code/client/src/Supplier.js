import React from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col, Container } from "react-bootstrap";

function Supplier(props) {


  return (
    <>
          <h1 className="below-nav main-content text-center">Supplier Panel</h1>

          <Container fluid className = "text-center">
          <h3>Manage Items</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createItem"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Create an Item </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editItem"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify fields of an Item </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deleteItem"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Delete an Item </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Restock Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deliverRO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Deliver a restock order </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />

          </Container>

    </>
  );
}

export default Supplier;