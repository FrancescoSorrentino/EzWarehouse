import React from 'react';
import { Link } from "react-router-dom";
import { Button, Row, Col, Container } from "react-bootstrap";

function Manager(props) {


  return (
    <>
          <h1 className="below-nav main-content text-center">Manager Panel</h1>

          <Container fluid className = "text-center">

          <h3>Surf Items</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/showItems"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> See Items </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            
            <h3>Manage Positions</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createPosition"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Create a position </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editBarcodePosition"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify barcode of a position </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editPosition"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify fields of a position </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deletePosition"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Delete a position </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage SKU</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createSKU"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Create a SKU </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editSKUPosition"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Assign/Modify position of a SKU </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editSKU"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify fields of a SKU </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deleteSKU"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Delete a SKU </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage Test Descriptors</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createTestDescriptor"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Create a Test Descriptor </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editTestDescriptor"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify fields of a Test Descriptor </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deleteTestDescriptor"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Delete a test Descriptor </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage User</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createUser"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Create a User </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editUser"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Modify rights of a User </Button> 
                </Link>
              </Col>
              <Col className="md-4 pr-0 pl-0 ">
                <Link to="/deleteUser"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Delete a user </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage Internal Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/editIO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Accept / Refuse an Internal Order </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage Restock Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createRO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Issue a Restock Order </Button> 
                </Link>
              </Col>
            </Row>
            <br /> <br />
            <h3>Manage Return Order</h3>
            <Row md={12}>
                <Col className="md-4 pr-0 pl-0 ">
                <Link to="/createREO"> 
                    <Button variant="warning" className="m-3 ml-2 md-1 "> Issue a Return Order </Button> 
                </Link>
              </Col>
            </Row>

          </Container>

    </>
  );
}

export default Manager;