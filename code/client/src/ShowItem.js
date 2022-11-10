import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function ShowItem(props) {
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState (props.suppliers && props.suppliers.length > 0 ? (props.suppliers[0].id):(0));
    const [products,setProducts] = useState([]);
    const [show,setShow] = useState (true);
    return (
        <div className="Registration" >

            {/* MODAL TO SELECT SUPPLIER */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>Select Supplier</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Supplier</Form.Label>
                    <Form.Select
                      id="selectSP"
                      onChange={(e) => {setId(e.target.value);
                        const identifier = e.target.value;
                        setProducts(props.items.filter((i)=>i.supplierId*1===identifier*1));
                    }}
                    >
                      <option>
                        Select Supplier
                      </option>
                      {props.suppliers.length > 0 ? (
                        props.suppliers.map((p) => (
                          <option value={p.id}>
                            {p.name} {p.surname}
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
              <Button variant="warning" id="submitButton" disabled={props.suppliers && (props.suppliers <= 0)} onClick={async () => {                   
                  setValidated(false);
                  setShow(false); }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Items sold by supplier {id} </h2>
                </Row>
                
                
                <Row>
                    <Col>
                        <Form.Group id="Products">
                            <Form.Label className={products.length===0 ? ('d-none'):('')}>
                                <b className='p-0'>Items: </b><br/>             
                            </Form.Label>
                                    
                            {products.map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={10} className="ps-3">
                                            {pos+1}) SKU ID: {el.SKUId} - {el.description} - Price: {el.price} €
                                        </Col>
                                    </Row>)}

                                    
                                </Form.Group>
                    </Col>
                </Row>
                <br />
                
                <Row>
                    <Col md={6} xs={6}/>
                    <Col md={3} xs={3} className="pl-5">
                        <Link to="/manager"> 
                            <Button variant="warning" className="m-3 ml-2 md-1 "> Back </Button> 
                        </Link>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default ShowItem;