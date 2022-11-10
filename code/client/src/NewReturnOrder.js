import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import {Plus, Trash} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import API from './API';

function NewReturnOrder(props) {
    const [validated, setValidated] = useState(false);
    const [products, setProducts] = useState ([]);
    const [id, setId] = useState (props.RO && props.RO.length > 0 ? (props.RO[0].id):(0));
    const [restockOrder, setRestockOrder] = useState (undefined);
    const [returnProducts, setReturnProducts] = useState ([]);
    const [addProducts, setAddProducts] = useState ([]);
    
    let date= new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour : 'numeric', minute: 'numeric' };
    const [returnDate, setReturnDate] = useState (date.toLocaleString('ja-JP',options).replace(',',''));

    const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
                date = new Date();
                setReturnDate(date.toLocaleString('ja-JP',options).replace(',',''));
                const newREO = {
                    returnDate:returnDate,
                    products: products,
                    restockOrderId: id
                };
    
            props.addREO(newREO,restockOrder.id);
            setProducts([]);
            setReturnProducts([]);
            setAddProducts([]);
            setId(0);    
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT RESTOCK ORDER COMPLETEDRETURN */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>Select Restock Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Restock Order to return products</Form.Label>
                    <Form.Select
                      id="selectRO"
                      onChange={(e) => {setId(e.target.value)
                                        const ident = e.target.value;
                                        for (let Ro of props.RO){
                                          if(ident*1 === Ro.id*1){
                                            setRestockOrder(Ro);
                                            setProducts([]);
                                            setAddProducts(Ro.skuItems);
                                            break;
                                          }
                                        }
                    }}
                    >
                      <option>
                        Select Restock Order
                      </option>
                      {props.RO.length > 0 ? (
                        props.RO.map((p) => (
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
              <Button variant="warning" id="submitButton" disabled={props.RO && (props.RO <= 0)} onClick={async () => { 
                  const items = await API.getSKUItemsToReturn(restockOrder.id);
                  setReturnProducts(items);
                  for (let item of items){
                      for(let product of restockOrder.products){
                        if(product.SKUId*1 === item.SKUId*1){
                            const returnItem ={
                                SKUId:item.SKUId,
                                itemId:product.itemId,
                                description:product.description,
                                price:product.price,
                                RFID:item.rfid
                            }
                            setProducts((oldList)=>[...oldList,returnItem]);
                            setAddProducts((oldList)=>oldList.filter((p)=>p.rfid!==item.rfid))
                        }
                    }
                  }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> New Return Order </h2>
                </Row>
                
                
                <Row>
                    <Col>
                        <Form.Group id="Products">
                            <Form.Label className={products.length===0 ? ('d-none'):('')}>
                                <b className='p-0'>SKU Items that will be returned: </b><br/>             
                            </Form.Label>
                                    
                            {products.map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={10} className="ps-3">
                                            {pos+1}) SKU ID: {el.SKUId} - {el.description} - RFID: {el.RFID} - Price: {el.price} €
                                        </Col>
                                        {!returnProducts.map((p)=>p.rfid).includes(el.RFID) &&
                                        <Col xs={2} className="text-end"
                                            onClick={() => {
                                                
                                                setProducts((oldList) => {
                                                    const list = oldList.filter((uid) => uid.RFID !== el.RFID);
                                                    return list;
                                                })
                                            }}
                                        >
                                            <Trash size={20} />
                                        </Col>}

                                    </Row>)}

                                    
                                </Form.Group>
                    </Col>
                </Row>
                <br />

                <Row>
                    <Col>
                        <Form.Group id="ProductsAdd">
                            <Form.Label>
                                <b className='p-0'>Add more SKU Items: </b><br/>             
                            </Form.Label>
                                  
                            {addProducts.length >0 && addProducts
                            .map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={10} className="ps-3">
                                            {pos+1}) SKU ID: {el.SKUId} - RFID: {el.rfid}
                                        </Col>
                                        
                                        <Col xs={2} className="text-end"
                                            onClick={() => {
                                                for(let product of restockOrder.products){
                                                    if(product.SKUId*1 === el.SKUId*1){
                                                        const returnItem ={
                                                            SKUId:el.SKUId,
                                                            itemId: product.itemId,
                                                            description:product.description,
                                                            price:product.price,
                                                            RFID:el.rfid
                                                        }
                                                        setProducts((oldList)=>[...oldList,returnItem]);
                                                    }
                                                }
                                                setAddProducts((oldPList)=>oldPList.filter((p)=>p.rfid !== el.rfid))

                                            }}
                                        >
                                            <Plus size={20} />
                                        </Col>

                                    </Row>)}

                                    
                                </Form.Group>
                    </Col>
                </Row>
                <br />
                    
                    
               
                
                
                <Row>
                    <Col md={6} xs={6}/>
                    <Col md={3} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Submit Return Order</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewReturnOrder;