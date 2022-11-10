import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import {Trash} from "react-bootstrap-icons";

function NewInternalOrder(props) {
    const [validated, setValidated] = useState(false);
    const [products, setProducts] = useState ([]);
    
    let date= new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour : 'numeric', minute: 'numeric' };
    const [issueDate, setIssueDate] = useState (date.toLocaleString('ja-JP',options).replace(',',''));

    //Fields of every product
    const [id, setId] = useState (props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));
    const [description, setDescription] = useState("");
    const [quantity,setQuantity] = useState(1);
    const [maxQuantity,setMaxQuantity] = useState(props.skus && props.skus.length > 0 ? (props.skus[0].availableQuantity):(1));
    const [price,setPrice] = useState (0.01);

    const [show,setShow] = useState (false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
                date = new Date();
                setIssueDate(date.toLocaleString('ja-JP',options).replace(',',''));
                const newIO = {
                    issueDate:issueDate,
                    products: products,
                    customerId: props.customerId
                };
    
            props.addIO(newIO);
            setProducts([]);    
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT SKU */}
            <Modal show={show}>
            <Modal.Header>
              <Modal.Title>What SKU you want to order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select SKU</Form.Label>
                    <Form.Select
                      id="selectSKU"
                      onChange={(e) => {setId(e.target.value)
                                        const id= e.target.value;
                                        for (let sku of props.skus){
                                            if(sku.id*1 === id*1){
                                                setDescription(sku.description); 
                                                setMaxQuantity(sku.availableQuantity);
                                                setPrice(sku.price);
                                            }
                                        }
                    }}
                      
                    >
                      <option>
                        Select SKU
                      </option>
                      {props.skus.length > 0 ? (
                        props.skus.filter((s)=>{
                            for (let prod of products){
                                if (prod.SKUId*1 === s.id*1)
                                    {return false;}
                            }
                            return true;
                        })
                        .map((p) => (
                          <option value={p.id}>
                            {p.id} - {p.description}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Form.Select>
                  </Form.Group>
                  <br />
                    <Form.Group>
                        <Form.Label>Unit Price:</Form.Label>
                            <Form.Control type="number" min="0.01" step="0.01" id="priceField" value={price} disabled={true} />
                            {price <= 0.0 && <Form.Control.Feedback type="invalid">
                            Please insert a valid price.
                            </Form.Control.Feedback>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                            <Form.Label>Quantity (max {maxQuantity}):</Form.Label>
                            <Form.Control
                                type='number'
                                id="quantityField"
                                value={quantity}
                                min={1}
                                max={maxQuantity}
                                required
                                onChange={ev => setQuantity(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid quantity number.
                            </Form.Control.Feedback>
                    </Form.Group>
                       
                
                </Form>
              </Col>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={()=>{
                        setId(props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));
                        setDescription("");
                        setQuantity(1);
                        setMaxQuantity(1);
                        setPrice(0.01);
                        setShow(false);
                    }}>Close</Button>
              <Button variant="warning" id="submitButton" disabled={props.skus && (props.skus <= 0)} onClick={() => { 
                  for (let sku of props.skus){
                    if(sku.id*1 === id*1){
                        setDescription(sku.description);  
                    }
                }
                  const newProduct = {
                    SKUId: id,
                    description: description,
                    price: price,
                    qty: quantity
                  }

                  setProducts(oldList => {return [...oldList, newProduct];})

                  setId(props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));
                  setDescription("");
                  setQuantity(1);
                  setMaxQuantity(1);
                  setPrice(0.01);
                  setShow(false) }}>
                Add to Order
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> New Internal Order </h2>
                </Row>
                
                
                <Row>
                    <Col>
                        <Form.Group id="Products">
                            <Form.Label className={products.length===0 ? ('d-none'):('')}>
                                <b className='p-0'>SKUs: </b><br/>             
                            </Form.Label>
                                    
                            {products.map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={10} className="ps-3">
                                            {pos+1}) ID: {el.SKUId} - {el.description} - Qty: {el.qty} - Price: {el.price} €
                                        </Col>
                                        
                                        <Col xs={2} className="text-end"
                                            onClick={() => {
                                                
                                                setProducts((oldList) => {
                                                    const list = oldList.filter((uid) => uid.SKUId !== el.SKUId);
                                                    return list;
                                                })
                                            }}
                                        >
                                            <Trash size={20} />
                                        </Col>

                                    </Row>)}

                                    
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                    
                    
               
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                    <Button variant="warning" onClick={()=>{setShow(true)}}>Add SKU</Button> 
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                
                <Row>
                    <Col md={6} xs={6}/>
                    <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setProducts([]); setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Submit Order</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewInternalOrder;