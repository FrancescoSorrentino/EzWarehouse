import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";

function TestRO (props){
  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.RO && props.RO.length > 0 ? (props.RO[0].id):(0));
  const [restockOrder, setRestockOrder] = useState (undefined);
  const [show,setShow] = useState (true);
  const [toDoTest,setToDoTest] = useState ([]);
  let array=[];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            props.editRO(id,{newState:"TESTED"});
            setId(0);
            setValidated(false);
        }    
    };

    return (
        <div className="Registration" >

            {/* MODAL TO SELECT RESTOCK ORDER DELIVERED */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What Restock Order you want to see?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Restock Order</Form.Label>
                    <Form.Select
                      id="selectRO"
                      onChange={(e) => {setId(e.target.value)
                                        const ident = e.target.value;
                                        for (let Ro of props.RO){
                                          if(ident*1 === Ro.id*1){
                                            setRestockOrder(Ro);

                                            
    
                                              Ro.skuItems.forEach((el) => {
                                                  props.testDescriptors.filter((t)=>t.idSKU*1 === el.SKUId*1).forEach((t)=>{
                                                        array.push(t.id+","+el.rfid);
                                                    })
                                              })
                                            
                                          
                                            setToDoTest(array);

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
              <Button variant="warning" id="submitButton" disabled={props.RO && (props.RO <= 0)} onClick={() => { 
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> Test SKU Items of Restock Order </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>Id Restock Order:</Form.Label>
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
                {restockOrder &&<Row>
                    <Col>
                        <Form.Group id="Products">
                            <Form.Label className={restockOrder.skuItems.length===0 ? ('d-none'):('')}>
                                <b className='p-0'>SKU Items: </b><br/>             
                            </Form.Label>
                                    
                            {restockOrder.skuItems.map((el, pos) => <Row className="border m-0 pt-1 pb-1">
                                        <Col xs={12} className="ps-3">
                                            {pos+1}) RFID: {el.rfid} - SKU ID: {el.SKUId}
                                        </Col>
                                        
                                          <Row>
                                            <Col>
                                            <b>TEST TO BE EXECUTED:</b>
                                            </Col>
                                          </Row>
                                          <br /><br/>
                                          {props.testDescriptors.filter((t)=>t.idSKU*1 === el.SKUId*1).map((t,pos,arr)=>{
                                          array.push(t.id+","+el.rfid);
                                          return (<>
                                          <Row>
                                            <Col>
                                              ID: {t.id} - NAME {t.name}
                                            </Col>
                                            {toDoTest.includes(t.id+","+el.rfid) &&
                                            <>
                                              <Col>
                                                <Button variant = 'success' onClick={()=>{
                                                  setToDoTest((oldList)=>{return oldList.filter((s)=>s!==t.id+","+el.rfid)})
                                                  const date = new Date();
                                                  const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
                                                  const TRDate = date.toLocaleString('ja-JP',options).replace(',','');
                                                  const TR={
                                                    rfid:el.rfid,
                                                    idTestDescriptor:t.id,
                                                    Date:TRDate,
                                                    Result: true

                                                  }
                                                  props.addTestResult(TR);
                                                }}>Passed</Button>
                                              </Col>
                                              <Col>
                                                <Button variant = 'danger' onClick={()=>{
                                                  setToDoTest((oldList)=>{return oldList.filter((s)=>s!==t.id+","+el.rfid)})
                                                  const date = new Date();
                                                  const options = { year: 'numeric', month: 'numeric', day: 'numeric'};
                                                  const TRDate = date.toLocaleString('ja-JP',options).replace(',','');
                                                  const TR={
                                                    rfid:el.rfid,
                                                    idTestDescriptor:t.id,
                                                    Date:TRDate,
                                                    Result: false

                                                  }
                                                  props.addTestResult(TR);
                                                }}>Failed</Button>
                                              </Col>
                                            </>
                                          }
                                          </Row> 
                                          <br /><br/><br/>
                                          </>) }
                                          )}
                                       
                                        

                                    </Row>)}

                                    
                                </Form.Group>
                            </Col>
                        </Row>}
                <br />
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" disabled={toDoTest.length!==0} id="submitButton" type="submit" className="float-right ">Tests Completed on Restock Order </Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default TestRO;