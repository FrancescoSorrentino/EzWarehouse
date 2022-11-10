import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import { Link } from "react-router-dom";
import './NewClientForm.css'

function EditPositionDeleteSKU (props){

  const [validated, setValidated] = useState(false);
  const [id, setId] = useState (props.skus && props.skus.length > 0 ? (props.skus[0].id):(0));

    const list = props.positions.length > 0 ? (
      props.positions.filter((p)=>{
        let found = 0;
        //Filter free positions
        for (let sku of props.skus){
          if (sku.position === p.positionID){
            found = 1;
            break;
          }
        }
        //Filter position capable enough
        for (let sku of props.skus){
          if (sku.id*1 === id*1){
            const skuVolume= sku.volume * sku.availableQuantity;
            const skuWeight= sku.weight * sku.availableQuantity;
            if(p.maxVolume < skuVolume || p.maxWeight < skuWeight)
            {
              found = 1;
              break;
            }
            
          }
        }
        if (found)
          return false;
        else
          return true;
        
      })
      
      .map((pos) => (
        pos.positionID
      ))
    ) : (
      []
    )

    const [barcode, setBarcode] = useState(list && list.length >0 ? (list[0]):(""));
    const [oldBarcode, setOldBarcode] = useState("");
    const [show,setShow] = useState (true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } 
        else {
            if(props.delete){
                props.deleteSKU(id);
                setId(0);
            }
            else{
            props.editSKUPosition(id,barcode);
                setBarcode("");
                setOldBarcode("");
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
                                                if(sku.position)
                                                  setOldBarcode(sku.position);
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
              <Button variant="warning" id="submitButton" disabled={props.skus && (props.skus <= 0)} onClick={() => { 
                  for (let sku of props.skus){
                    if(sku.id*1 === id*1){
                      if(sku.position)
                        setOldBarcode(sku.position); 
                    }
                }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.delete?("Delete"):("Edit")} SKU </h2>
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
                {!props.delete &&<>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group>
                            <Form.Label>Old Position:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="oldBarcodeField"
                                disabled={true}
                                value={oldBarcode === ""?("No Position Assigned"):(oldBarcode)}
                                required
                               />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid barcode.
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
                            <Form.Label>New Position:</Form.Label>
                            <Form.Select
                                autoFocus
                                id="barcodeField"
                                required
                                onChange={(e) => {setBarcode(e.target.value)}}>

                                        {props.positions.length > 0 ? (
                                          props.positions.filter((p)=>{
                                            let found = 0;
                                            //Filter free positions
                                            for (let sku of props.skus){
                                              if (sku.position === p.positionID){
                                                found = 1;
                                                break;
                                              }
                                            }
                                            //Filter position capable enough
                                            for (let sku of props.skus){
                                              if (sku.id*1 === id*1){
                                                const skuVolume= sku.volume * sku.availableQuantity;
                                                const skuWeight= sku.weight * sku.availableQuantity;
                                                if(p.maxVolume < skuVolume || p.maxWeight < skuWeight)
                                                {
                                                  found = 1;
                                                  break;
                                                }
                                                
                                              }
                                            }
                                            if (found)
                                              return false;
                                            else
                                              return true;
                                            
                                          })
                                          
                                          .map((pos) => (
                                            <option value={pos.positionID}>
                                              {pos.positionID}
                                            </option>
                                          ))
                                        ) : (
                                          <></>
                                        )} 
                      </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid positionID.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                </>}
                <Row>
                    <Col md={6} xs={6}/>
                   
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant={props.delete ?("danger"):("warning")} color="black" id="submitButton" type="submit" className="float-right ">{props.delete ?("Delete"):("Edit")} SKU</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )

}

export default EditPositionDeleteSKU;