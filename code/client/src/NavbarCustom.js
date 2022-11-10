import React, { useState } from 'react';
import { NavLink, Navbar, Col, Row } from "react-bootstrap";
import { PersonCircle, DoorOpenFill, HouseDoorFill, BellFill, ClockFill } from "react-bootstrap-icons"
import { Link } from "react-router-dom";
import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { toast } from "react-toastify";
import { LogButton } from './Login';


function NavbarCustom(props) {

  function checkType() {
    if (props.user && props.user.id && props.user.type === 'C') {
      return (
        <>
          <Row>

            <Link to="/customer" style={{ color: 'white' }}>
              <PersonCircle size={30} />
            </Link>
          </Row>
        </>
      )
    }
    else if (props.user && props.user.id && props.user.type === 'M') {
      return (
        <>
          <Link to="/manager" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
    else if (props.user && props.user.id && props.user.type === 'S') {
      return (
        <>
          <Link to="/supplier" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
    else if (props.user && props.user.id && props.user.type === 'K') {
      return (
        <>
          <Link to="/clerk" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
    else if (props.user && props.user.id && props.user.type === 'Q') {
      return (
        <>
          <Link to="/qualityEmployee" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
    else if (props.user && props.user.id && props.user.type === 'D') {
      return (
        <>
          <Link to="/deliveryEmployee" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
    else {
      return (
        <>
          <Link to="/login" style={{ color: 'white' }}>
            <PersonCircle size={30} />
          </Link>
        </>
      )
    }
  }

  return (
    <Navbar className="navbar navbar-dark navbar-expand-sm fixed-top">

      

      <Col md={4} xs={1}></Col>  

       <Col md={4} xs={2}><h1 className='text-center'>EZWH</h1></Col>

      <Col md={4} xs={9} className="navbar-nav ml-md-auto justify-content-end">
        <NavLink className="nav-item nav-link mr-3">
          <Link to="/home" style={{ color: 'white' }}>
            <HouseDoorFill size={30} />
          </Link>
        </NavLink>
        <NavLink className="nav-item nav-link">
          <>
            {
              props.logged ?
                <>

                  {
                    checkType()
                  }
                </>
                :
                <Link to="/login" style={{ color: 'white' }}>
                  <PersonCircle size={30} />
                </Link>
            }
          </>


        </NavLink>

        <NavLink className="nav-item nav-link ml-3" href="#" onClick={props.logout}>
          {props.logged && <LogButton loggedIn={props.logged}></LogButton>}

        </NavLink>
      </Col>
    </Navbar>
  );
}


export default NavbarCustom;