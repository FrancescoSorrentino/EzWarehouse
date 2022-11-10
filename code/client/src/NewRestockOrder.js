import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";
import {Trash} from "react-bootstrap-icons";

function NewRestockOrder(props) {
    const [validated, setValidated] = useState(false);
    const [products, setProducts] = useState ([]);
    const [supplierId, setSupplierId] = useState (0)
    
    let date= new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour : 'numeric', minute: 'numeric' };
    const [issueDate, setIssueDate] = useState (date.toLocaleString('ja-JP',options).replace(',',''));

    //Fields of every product
    const [id, setId] = useState (0);
    const [description, setDescription] = useState("");
    const [quantity,setQuantity] = useState(1);
    const [itemId,setItemId] = useState(0);
    const [price,setPrice] = useState (0.01);

    const [show,setShow] = useState (false);
    const [showSupplier,setShowSupplier] = useState (false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
                date = new Date();
                setIssueDate(date.toLocaleString('ja-JP',options).replace(',',''));
                const newRO = {
                    issueDate:issueDate,
                    products: products,
                    supplierId: supplierId
                };
    
            props.addRO(newRO);
            setProducts([]);
            setSupplierId(0);    
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT SUPPLIER */}
            <Modal show={showSupplier} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>SELECT SUPPLIER</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select a supplier</Form.Label>
                    <Form.Select
                      id="selectSP"
                      onChange={(e) => {setSupplierId(e.target.value)
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
              <Button variant="warning" id="submitButton" disabled={props.suppliers && (props.suppliers <= 0)} onClick={() => {
                  setShowSupplier(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            {/* MODAL TO SELECT SKU */}
            <Modal show={show}>
            <Modal.Header>
              <Modal.Title>What SKU you want to order?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select SKU (according to products sold by supplier)</Form.Label>
                    <Form.Select
                      id="selectSKU"
                      onChange={(e) => {setId(e.target.value)
                                        const id= e.target.value;
                                        for (let sku of props.skus){
                                            if(sku.id*1 === id*1){
                                                setDescription(sku.description);
                                            }
                                        }
                                        for(let item of props.items){
                                          if (id*1 === item.SKUId*1 && supplierId*1 === item.supplierId*1){
                                            setItemId(item.id)
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
                        //Filter according to current supplierId
                        .filter((s)=>{
                            for(let item of props.items){
                              if (s.id*1 === item.SKUId*1 && supplierId*1 === item.supplierId*1)
                                  {return true;}
                            }
                        return false;
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
                            <Form.Control type="number" min="0.01" step="0.01" id="priceField" value={price} onChange={ev => setPrice(ev.target.value)} />
                            {price <= 0.0 && <Form.Control.Feedback type="invalid">
                            Please insert a valid price.
                            </Form.Control.Feedback>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                            <Form.Label>Quantity:</Form.Label>
                            <Form.Control
                                type='number'
                                id="quantityField"
                                value={quantity}
                                min={1}
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
                        setId(0);
                        setItemId(0);
                        setDescription("");
                        setQuantity(1);
                        setPrice(0.01);
                        setShow(false);
                    }}>Close</Button>
              <Button variant="warning" id="submitButton" disabled={props.skus && (props.skus <= 0)} onClick={() => { 
                  for (let sku of props.skus){
                    if(sku.id*1 === id*1){
                        setDescription(sku.description);  
                    }
                }
                for(let item of props.items){
                  if (id*1 === item.SKUId*1 && supplierId*1 === item.supplierId*1){
                    setItemId(item.id)
                  }
                }
                  const newProduct = {
                    SKUId: id,
                    itemId: itemId,
                    description: description,
                    price: price,
                    qty: quantity
                  }

                  setProducts(oldList => {return [...oldList, newProduct];})

                  setId(0);
                  setItemId(0);
                  setDescription("");
                  setQuantity(1);
                  setPrice(0.01);
                  setShow(false) }}>
                Add to Order
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> New Restock Order </h2>
                </Row>

                <Row>
                    <Col>
                        <Form.Group id="Supplier">
                            <Form.Label className={supplierId===0 ? ('d-none'):('')}>
                                <b className='p-0'>Supplier: </b><br/>             
                            </Form.Label>
                                    
                            {props.suppliers.filter((s)=>s.id*1===supplierId*1)
                                .map((el) => 
                                    
                                     <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={10} className="ps-3">
                                            ID:{el.id}, {el.name} {el.surname}
                                        </Col>

                                            </Row>
                                        )
                            }        
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                
                
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
                    <Button variant="warning" disabled={supplierId*1===0} onClick={()=>{setShow(true)}}>Add SKU</Button> 
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                {supplierId === 0 && <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                    <Button variant="warning" onClick={()=>{setShowSupplier(true)}}>Select Supplier</Button> 
                    </Col>
                    <Col xs={2} />
                </Row>}
                <br />

                
                <Row>
                    <Col md={6} xs={6}/>
                    <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setProducts([]); setSupplierId(0); setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">Submit Restock Order</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewRestockOrder;