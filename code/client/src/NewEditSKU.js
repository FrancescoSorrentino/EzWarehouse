import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function NewEditSKU(props) {
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState (props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));
    const [description, setDescription] = useState("");
    const [weight, setWeight] = useState(1);
    const [volume, setVolume] = useState(1);
    const [notes, setNotes] = useState("");
    const [price, setPrice] = useState(0.01);
    const [availableQuantity, setAvailableQuantity] = useState(1);

    const [show,setShow] = useState (props.edit?(true):(false));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
            if(props.edit){
                const newSku = {
                    newDescription:description,
                    newWeight: weight,
                    newVolume: volume,
                    newNotes: notes,
                    newAvailableQuantity: availableQuantity,
                    newPrice: price
                };
    
                props.editSKU(id,newSku);
            }
            else{
                const newSku = {
                    description:description,
                    weight: weight,
                    volume: volume,
                    notes: notes,
                    availableQuantity: availableQuantity,
                    price: price
                };
    
            props.addSKU(newSku);
            setDescription(""); 
            setNotes("");
            setAvailableQuantity(1); 
            setWeight(1); 
            setVolume(1);
            setPrice(0.01); 
            setId(0);
            
            }

            
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT SKU */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What SKU you want to modify?</Modal.Title>
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
                                                setVolume(sku.volume); 
                                                setWeight(sku.weight);  
                                                setNotes(sku.notes); 
                                                setPrice(sku.price);
                                                setAvailableQuantity(sku.availableQuantity); 
                                            }
                                        }
                    }}
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
                </Form>
              </Col>
            </Modal.Body>
            <Modal.Footer>
            <Link to="/login"> 
                    <Button variant="secondary" className="m-3 ml-2 md-1 "> Back to your page </Button> 
              </Link>
              <Button variant="warning" id="submitButton" disabled={props.skus && (props.skus <= 0)} onClick={() => { 
                  for (let sku of props.skus){
                    if(sku.id*1 === id*1){
                        setDescription(sku.description); 
                        setVolume(sku.volume); 
                        setWeight(sku.weight);  
                        setNotes(sku.notes); 
                        setPrice(sku.price);
                        setAvailableQuantity(sku.availableQuantity); 
                    }
                }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.edit?("Edit"):("New")} SKU </h2>
                </Row>
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
                        <Form.Group controlId='number'>
                            <Form.Label>Weight:</Form.Label>
                            <Form.Control
                                type='number'
                                id="weightField"
                                value={weight}
                                min={1}
                                required
                                onChange={ev => setWeight(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a weight number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group controlId='number'>
                            <Form.Label>Volume:</Form.Label>
                            <Form.Control
                                type='number'
                                id="volumeField"
                                value={volume}
                                min={1}
                                required
                                onChange={ev => setVolume(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a volume number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Notes:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="notesField"
                                value={notes}
                                required
                                onChange={ev => setNotes(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert valid notes.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group controlId='number'>
                            <Form.Label>Available Quantity:</Form.Label>
                            <Form.Control
                                type='number'
                                id="availableField"
                                value={availableQuantity}
                                min={1}
                                required
                                onChange={ev => setAvailableQuantity(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid available quantity number.
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
                    <Col md={6} xs={6}/>
                    {!props.edit && <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setId(0); setDescription(""); setNotes(""); setAvailableQuantity(1); setWeight(1); setVolume(1); setPrice(0.01);  setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>}
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">{props.edit ?("Edit"):("Create")} SKU</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewEditSKU;