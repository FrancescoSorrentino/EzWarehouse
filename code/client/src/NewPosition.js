import React from 'react';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap';
import { useState } from 'react'
import './NewClientForm.css'
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function NewPosition(props) {
    const [validated, setValidated] = useState(false);
    const [barcode, setBarcode] = useState(props.positions && props.edit && props.positions.length>0 ? (props.positions[0].positionID):(""));
    const [aisleID, setAisleID] = useState(0);
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [maxVolume, setMaxVolume] = useState(0);
    const [maxWeight, setMaxWeight] = useState(0);
    const [occupiedVolume, setOccupiedVolume] = useState(0);
    const [occupiedWeight, setOccupiedWeight] = useState(0);

    const [show,setShow] = useState (props.edit?(true):(false));

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        const form = event.currentTarget;
        let usedBarcode = -1;
        if(!props.edit){
            for(let pos of props.positions){
                if(pos.positionID === barcode)
                    usedBarcode = 1;
            }
        }
        if (form.checkValidity() === false || (usedBarcode !== -1 && !props.edit)) {
            event.stopPropagation();
            if (usedBarcode !== -1 && !props.edit) {
                toast.error("Barcode already used", { position: "top-center" },{toastId: 6})
            }

        } else {
            if(props.edit){
                const newPosition = {
                    positionID:barcode,
                    newAisleID:aisleID,
                    newRow: row,
                    newCol: col,
                    newMaxWeight: maxWeight,
                    newMaxVolume: maxVolume,
                    newOccupiedWeight: occupiedWeight,
                    newOccupiedVolume: occupiedVolume
                };
    
                props.editPosition(newPosition);
            }
            else{
            const newPosition = {
                positionID:barcode,
                aisleID:aisleID,
                row: row,
                col: col,
                maxWeight: maxWeight,
                maxVolume: maxVolume
            };

            props.addPosition(newPosition);
            setBarcode(""); 
            setAisleID(""); 
            setRow(""); 
            setCol(""); 
            setMaxVolume(0); 
            setMaxWeight(0);  
            setOccupiedVolume(0); 
            setOccupiedWeight(0); 
            }

            
            setValidated(false);
        }
        
    };


    return (
        <div className="Registration" >

            {/* MODAL TO SELECT POSITION */}
            <Modal show={show} 
            backdrop="static"
            keyboard={false}>
            <Modal.Header>
              <Modal.Title>What position you want to modify?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col>
                <Form>
                  <Form.Group>
                    <Form.Label>Select Position</Form.Label>
                    <Form.Select
                      id="selectPosition"
                      onChange={(e) => {setBarcode(e.target.value)
                                        const barc= e.target.value;
                                        for (let pos of props.positions){
                                            if(pos.positionID === barc){
                                                setAisleID(pos.aisleID); 
                                                setRow(pos.row); 
                                                setCol(pos.col); 
                                                setMaxVolume(pos.maxVolume); 
                                                setMaxWeight(pos.maxWeight);  
                                                setOccupiedVolume(pos.occupiedVolume); 
                                                setOccupiedWeight(pos.occupiedWeight); 
                                            }
                                        }
                    }}
                    >
                    <option>
                        Select Barcode
                      </option>  
                      {props.positions.length > 0 ? (
                        props.positions.map((p) => (
                          <option value={p.positionID}>
                            {p.positionID}
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
              <Button variant="warning" id="submitButton" disabled={props.positions && (props.positions.length <= 0)} onClick={() => { 
                  for (let pos of props.positions){
                    if(pos.positionID === barcode){
                        setAisleID(pos.aisleID); 
                        setRow(pos.row); 
                        setCol(pos.col); 
                        setMaxVolume(pos.maxVolume); 
                        setMaxWeight(pos.maxWeight);  
                        setOccupiedVolume(pos.occupiedVolume); 
                        setOccupiedWeight(pos.occupiedWeight); 
                    }
                }
                  setShow(false) }}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="pt-5">
                <Row className="justify-content-center">
                    <h2 className='text-center'> {props.edit?("Edit"):("New")} Position </h2>
                </Row>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group  >
                            <Form.Label>Position ID:</Form.Label>
                            <Form.Control
                                autoFocus
                                type='text'
                                id="barcodeField"
                                disabled={props.edit}
                                value={barcode}
                                required
                                onChange={ev => setBarcode(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a valid position ID.
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
                            <Form.Label>Aisle ID (4 digits):</Form.Label>
                            <Form.Control
                                type='text'
                                id="aisleIDField"
                                value={aisleID}
                                required
                                onChange={ev => setAisleID(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert an aisle ID.
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
                            <Form.Label>Row (4 digits):</Form.Label>
                            <Form.Control
                                type='text'
                                id="rowField"
                                value={row}
                                required
                                onChange={ev => setRow(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a row number.
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
                            <Form.Label>Col(4 digits):</Form.Label>
                            <Form.Control
                                type='text'
                                id="colField"
                                value={col}
                                required
                                onChange={ev => setCol(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a col number.
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
                            <Form.Label>Max weight:</Form.Label>
                            <Form.Control
                                type='number'
                                id="maxWeightField"
                                value={maxWeight}
                                min={1}
                                required
                                onChange={ev => setMaxWeight(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a max weight number.
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
                            <Form.Label>Max volume:</Form.Label>
                            <Form.Control
                                type='number'
                                id="maxVolumeField"
                                value={maxVolume}
                                min={1}
                                required
                                onChange={ev => setMaxVolume(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert a max volume number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br />
                { props.edit && <>
                <Row>
                    <Col xs={2} />
                    <Col xs={8}>
                        <Form.Group controlId='number'>
                            <Form.Label>Occupied Weight:</Form.Label>
                            <Form.Control
                                type='number'
                                id="occupiedWeightField"
                                value={occupiedWeight}
                                min={0}
                                max={maxWeight}
                                required
                                onChange={ev => setOccupiedWeight(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert an occupied weight number.
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
                            <Form.Label>Occupied volume:</Form.Label>
                            <Form.Control
                                type='number'
                                id="occupiedVolumeField"
                                value={occupiedVolume}
                                min={0}
                                max={maxVolume}
                                required
                                onChange={ev => setOccupiedVolume(ev.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please insert an occupied volume number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col xs={2} />
                </Row>
                <br /> </>}
                <Row>
                    <Col md={6} xs={6}/>
                    {!props.edit && <Col md={2} xs={1}>
                        <Button id="clearButton" onClick={() => { setBarcode(""); setAisleID(""); setRow(""); setCol(""); setMaxVolume(0); setMaxWeight(0); setOccupiedVolume(0); setOccupiedWeight(0);  setValidated(false); }} type="button" variant="secondary" className="float-right">Clear</Button>
                    </Col>}
                    <Col md={1} xs={3} className="pl-5">
                        <Button variant="warning" color="black" id="submitButton" type="submit" className="float-right ">{props.edit ?("Edit"):("Create")} Position</Button>
                    </Col>
                    <Col md={3} xs={2}/>
                </Row>
            </Form >
        </div>
    )
}


export default NewPosition;