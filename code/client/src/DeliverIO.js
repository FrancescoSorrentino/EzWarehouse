import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";

function DeliverIO (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.IOAccepted && props.IOAccepted.length > 0 ? (props.IOAccepted[0].id):(0));
  const [internalOrder, setInternalOrder] = useState ({});
  const [show,setShow] = useState (true);
  const [products, setProducts] = useState ([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            props.editIO(id,{newState:"COMPLETED",
                            products: products});
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT INTERNAL ORDER ACCEPTED */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Internal Order you want to deliver?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Internal Order</Form.Label>
                    <Form.Select
                      id="selectIO"
                      onChange={(e) => {setId(e.target.value)
                                        const ident = e.target.value;
                                        for (let Io of props.IOAccepted){
                                          if(ident*1 === Io.id*1){
                                            setInternalOrder(Io);
                                            break;
                                          }
                                        }
                    }}
                    >
                      <option>
                        Select Internal Order
                      </option>
                      {props.IOAccepted.length > 0 ? (
                        props.IOAccepted.map((p) => (
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
              <Button variant="warning" id="submitButton" disabled={props.IOAccepted && (props.IOAccepted <= 0)} onClick={() => { 
                  let listaProdotti = [];
                  for(let product of internalOrder.products){
                    for (let i=0; i<product.qty*1;i++){
                      //Find minimum of sku not in products array
                      let skuItem=undefined;
                      props.skuItems.filter((i)=>{
                        if(i.Available*1 ===0)
                          return false;
                        return !listaProdotti.map((p)=>p.RFID).includes(i.RFID);
                      })
                      .forEach((item)=>{
                        if(item.SKUId*1 === product.SKUId &&
                          (!skuItem || item.DateOfStock < skuItem.DateOfStock)){
                          skuItem = item;
                        }
                      })
                      //Add minimum to products array
                      listaProdotti.push({
                        SkuID:skuItem.SKUId,
                        RFID:skuItem.RFID
                      })
                    }
                  }
                  setProducts(listaProdotti);
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Deliver Internal Order </h2>
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
                <br />
                <Row>
                    <Col>
                        <Form.Group id="Products">
                            <Form.Label className={products.length===0 ? ('d-none'):('')}>
                                <b className='p-0'>SKU Items to deliver: </b><br/>             
                            </Form.Label>
                                    
                            {products.map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={12} className="ps-3">
                                            {pos+1}) SKU ID: {el.SkuID} - RFID: {el.RFID}
                                        </Col>
                                        

                                    </Row>)}

                                    
                                </Form.Group>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Deliver Internal Order </Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default DeliverIO;