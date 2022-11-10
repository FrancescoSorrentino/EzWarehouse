import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function NewEditItem(props) {
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState (props.items && props.items.length > 0 ? (props.items[0].id):(0));
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0.01);
    const [supplierId, setSupplierId] = useState (props.supplierId);
    const [SKUId, setSKUId] = useState (props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));

    const [show,setShow] = useState (props.edit?(true):(false));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
            if(props.edit){
                const newItem = {
                    newDescription:description,
                    newPrice: price
                };
    
                props.editItem(id,newItem);
            }
            else{
                const newItem = {
                    id:id,
                    description:description,
                    price: price,
                    SKUId: SKUId,
                    supplierId: supplierId
                };
    
            props.addItem(newItem);
            setDescription(""); 
            setPrice(0.01); 
            setId(0);
            setSupplierId(0);
            setSKUId(0);

            }

            
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT ITEM */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Item you want to modify?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Item</Form.Label>
                    <Form.Select
                      id="selectItem"
                      onChange={(e) => {setId(e.target.value)
                                        const id= e.target.value;
                                        for (let item of props.items){
                                            if(item.id*1 === id*1){
                                                setDescription(item.description); 
                                                setPrice(item.price);
                                                setSupplierId(item.supplierId);
                                                setSKUId(item.SKUId); 
                                            }
                                        }
                    }}
                    >
                      <option>
                          Select Item
                      </option>
                      {props.items.length > 0 ? (
                        props.items.map((p) => (
                          <option value={p.id}>
                            {p.id} - {p.description}
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
              <Button variant="warning" id="submitButton" disabled={props.items && (props.items <= 0)} onClick={() => { 
                  for (let item of props.items){
                    if(item.id*1 === id*1){
                        setDescription(item.description); 
                        setPrice(item.price);
                        setSupplierId(item.supplierId);
                        setSKUId(item.SKUId); 
                    }
                }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.edit?("Edit"):("New")} Item </h2>
                </Row>
                {!props.edit && <>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Id:</Form.Label>
                            <Form.Control
                                 type='number'
                                 id="id"
                                 value={id}
                                 min={1}
                                 required
                                 onChange={ev => setId(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid id.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
          </>}
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Description:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="descriptionField"
                                value={description}
                                required
                                onChange={ev => setDescription(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid description.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                        <Col xs={2} />
                        <Col xs={8}>
                            <Form.Group>
                                <Form.Label>Unit Price:</Form.Label>
                                <Form.Control type="number" min="0.01" step="0.01" id="priceField" value={price} onChange={ev => setPrice(ev.target.value)} />
                                {price <= 0.0 && <Form.Control.Feedback type="invalid">
                                    Please insert a valid price.
                                </Form.Control.Feedback>}
                            </Form.Group>
                        </Col>
                        <Col xs={2} />
                    </Row>
                <Row>
                <br />
                { !props.edit &&  
                <>
                <br /><br />
                
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>Id SKU:</Form.Label>
                            
                            <Form.Select
                                id="selectSKU"
                                onChange={(e) => {setSKUId(e.target.value)}}
                                
                                >
                                <option>
                                    Select SKU
                                </option>
                                {props.skus.length > 0 ? (
                                    props.skus.map((p) => (
                                    <option value={p.id}>
                                        {p.id} - {p.description}
                                    </option>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </Form.Select>
                        
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                </> }
                <br /><br />
                    <Col md={6} xs={6}/>
                    {!props.edit && <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setId(0); setDescription(""); setSKUId(0); setSupplierId(0); setPrice(0.01);  setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>}
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">{props.edit ?("Edit"):("Create")} Item</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewEditItem;