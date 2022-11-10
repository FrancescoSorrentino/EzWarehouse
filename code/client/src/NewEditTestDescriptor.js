import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function NewEditTestDescriptor(props) {
    const [validated, setValidated] = useState(false);
    const [id, setId] = useState (props.testDescriptors && props.testDescriptors.length > 0 ? (props.testDescriptors[0].id):(0));
    const [idSku, setIdSku] = useState (props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));
    const [oldIdSku, setOldIdSku] = useState (0);
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [changeSku, setChangeSku] = useState(false);

    const [show,setShow] = useState (props.edit?(true):(false));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false ) {
            event.stopPropagation();
        
        } else {
            if(props.edit){
                const newTestDescriptor = {
                    newProcedureDescription:description,
                    newName: name,
                    newIdSKU: idSku
                };
    
                props.editTestDescriptor(id,newTestDescriptor);
            }
            else{
                const newTestDescriptor = {
                    procedureDescription:description,
                    name: name,
                    idSKU: idSku
                };
    
            props.addTestDescriptor(newTestDescriptor);
            setDescription(""); 
            setName("");
            setIdSku(0);
            setId(0);
            
            }

            
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT TEST DESCRIPTOR */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Test Descriptor you want to modify?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Test Descriptor</Form.Label>
                    <Form.Select
                      id="selectTD"
                      onChange={(e) => {setId(e.target.value)
                                        const id= e.target.value;
                                        for (let td of props.testDescriptors){
                                            if(td.id*1 === id*1){
                                                setDescription(td.procedureDescription); 
                                                setName(td.name); 
                                                setIdSku(td.idSKU);
                                                setOldIdSku(td.idSKU);
                                            }
                                        }
                    }}
                    >
                    <option>
                        Select Test Descriptor
                      </option>  
                      {props.testDescriptors.length > 0 ? (
                        props.testDescriptors.map((p) => (
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
              <Button variant="warning" id="submitButton" disabled={props.testDescriptors && (props.testDescriptors <= 0)} onClick={() => { 
                  for (let td of props.testDescriptors){
                    if(td.id*1 === id*1){
                        setDescription(td.procedureDescription); 
                        setName(td.name); 
                        setIdSku(td.idSKU);
                        setOldIdSku(td.idSKU);
                    }
                }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.edit?("Edit"):("New")} Test Descriptor </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="nameField"
                                value={name}
                                required
                                onChange={ev => setName(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert valid name.
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
                            <Form.Label>Procedure Description:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="descriptionField"
                                value={description}
                                required
                                onChange={ev => setDescription(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid procedure description.
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
                            <Form.Label>Id SKU:</Form.Label>
                            {props.edit && <Form.Check 
                                label={"Check to edit sku id"}
                                value={changeSku}
                                onChange={()=>{
                                    if(changeSku){
                                        setIdSku(oldIdSku);
                                    }
                                    setChangeSku((oldval)=>!oldval)}}
                            />}
                            { props.edit && !changeSku &&
                                
                                <Form.Control
                                autoFocus
                                type='number'
                                id="idSkuField"
                                value={idSku}
                                disabled={true}
                                required/>
                            }
                            { (!props.edit || changeSku) &&
                            <Form.Select
                                id="selectSKU"
                                onChange={(e) => {setIdSku(e.target.value)}}
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
                        }
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <Row>
                    <Col md={6} xs={6}/>
                    {!props.edit && <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => {setDescription(""); setName(""); setIdSku(0); setId(0);  setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>}
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">{props.edit ?("Edit"):("Create")} Test Descriptor</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewEditTestDescriptor;