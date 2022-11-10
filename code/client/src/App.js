import './App.css';
import React, { useState, useEffect } from "react";
import { Login, LoginButton } from "./Login";
import NavbarCustom from "./NavbarCustom.js";
import { ToastContainer,toast } from "react-toastify";
import API from "./API";
import Manager from './Manager.js';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.css';
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import NewPosition from './NewPosition.js';
import EditDeleteBarcodePosition from './EditDeleteBarcodePosition';
import NewEditSKU from './NewEditSKU.js';
import EditPositionDeleteSKU from './EditPositionDeleteSKU';
import NewEditTestDescriptor from './NewEditTestDescriptor';
import DeleteTestDescriptor from './DeleteTestDescriptor';
import NewUserForm from './NewUserForm';
import EditDeleteUser from './EditDeleteUser';
import Customer from './Customer';
import NewInternalOrder from './NewInternalOrder';
import AcceptCancelRejectIO from './AcceptCancelRejectIO';
import NewRestockOrder from './NewRestockOrder';
import Supplier from './Supplier';
import DeliverRO from './DeliverRO';
import Clerk from './Clerk';
import AcceptRO from './AcceptRO';
import QualityEmployee from './QualityEmployee';
import TestRO from './TestRO';
import StockRO from './StockRO';
import NewReturnOrder from './NewReturnOrder';
import DeliveryEmployee from './DeliveryEmployee';
import DeliverIO from './DeliverIO';
import NewEditItem from './NewEditItem';
import DeleteItem from './DeleteItem';
import ShowItem from './ShowItem';

function App() {

  //STATES
  const [loggedIn, setLoggedIn] = useState(false);
  const [userdata, setUserData] = useState({});
  const [update, setUpdate] = useState(false);
  const [updatePosition, setUpdatePosition] = useState(true);
  const [updateSKU, setUpdateSKU] = useState(true);
  const [updateTestDescriptor, setUpdateTestDescriptor] = useState(true);
  const [updateUser, setUpdateUser] = useState(true);
  const [updateIOIssued, setUpdateIOIssued] = useState(true);
  const [updateIOAccepted, setUpdateIOAccepted] = useState(true);
  const [updateROIssued, setUpdateROIssued] = useState(true);
  const [updateRO, setUpdateRO] = useState(true);
  const [updateSKUItem, setUpdateSKUItem] = useState(true);
  const [updateItem, setUpdateItem] = useState(true);

  //ELEMENTS from db
  const [positions, setPositions] = useState([]);
  const [skus, setSkus] = useState ([]);
  const [testDescriptors, setTestDescriptors] = useState ([]);
  const [users, setUsers] = useState ([]);
  const [suppliers,setSuppliers] = useState([]);
  const [IOIssued, setIOIssued] = useState([]);
  const [IOAccepted, setIOAccepted] = useState([]);
  const [ROIssued, setROIssued] = useState([]);
  const [RO, setRO] = useState([]);
  const [SKUItems, setSKUItems] = useState ([]);
  const [newRFID, setNewRFID] = useState("00000000000000000000000000000001");
  const [items, setItems] = useState ([]);

  const zeroPad = (num, places) => String(num).padStart(places, '0');

  //USE EFFECTS
   //authenticator
   useEffect(() => {
    const checkAuth = async () => {
      try {
        let user = await API.getUserInfo();
        user.type = user.type.toLowerCase() === "clerk" ? ("K"):(user.type.charAt(0).toUpperCase());
        console.log(user);
        setLoggedIn(true);
        setUserData(user);
        setUpdate(true);
      } catch (err) {
        setUpdate(true);
      }
    };
    checkAuth();
  }, []);

   //update positions
   useEffect(() => {
    async function fetchData(){
      if(updatePosition || loggedIn){
        const positionList = await API.getPositions();
        setPositions(positionList);
        setUpdatePosition(false);
      }
    }
    fetchData();
    
  }, [updatePosition,loggedIn]);

  //update skus
  useEffect(() => {
    async function fetchData(){
      if(updateSKU || loggedIn){
        const skusList = await API.getSKU();
        setSkus(skusList);
        setUpdateSKU(false);
      }
    }
    fetchData();
    
  }, [updateSKU,loggedIn]);

  //update sku items
  useEffect(() => {
    async function fetchData(){
      if(updateSKUItem || loggedIn){
        const skusItemList = await API.getSKUItems();
        //New RFID
        let RFID = "00000000000000000000000000000000";
        //Check Max RFID
        for(let skuitem of skusItemList){
          if (skuitem.RFID > RFID)
            RFID=skuitem.RFID
        }
        RFID = RFID*1 + 1;
        setNewRFID(zeroPad(RFID,32));
        setSKUItems(skusItemList);
        setUpdateSKUItem(false);
      }
    }
    fetchData();
    
  }, [updateSKUItem,loggedIn]);

  //update test descriptors
  useEffect(() => {
    async function fetchData(){
      if(updateTestDescriptor || loggedIn){
        const tdList = await API.getTestDescriptors();
        setTestDescriptors(tdList);
        setUpdateTestDescriptor(false);
      }
    }
    fetchData();
  }, [updateTestDescriptor,loggedIn]);

  //update users
  useEffect(() => {
    async function fetchData(){
      if(updateUser || loggedIn){
        const userList = await API.getUsers();
        setUsers(userList);
        const supplierList = await API.getSuppliers();
        setSuppliers(supplierList);
        setUpdateUser(false);
      }
    }
    fetchData();
  }, [updateUser, loggedIn]);

  //update IO Issued
  useEffect(() => {
    async function fetchData(){
      if(updateIOIssued || loggedIn){
        const IOs = await API.getIOIssued();
        setIOIssued(IOs);
        setUpdateIOIssued(false);
      }
    }
    fetchData();
  }, [updateIOIssued, loggedIn]);

  //update IO Accepted
  useEffect(() => {
    async function fetchData(){
      if(updateIOAccepted || loggedIn){
        const IOs = await API.getIOAccepted();
        setIOAccepted(IOs);
        setUpdateIOAccepted(false);
      }
    }
    fetchData();
  }, [updateIOAccepted,loggedIn]);

  //update RO Issued
  useEffect(() => {
    async function fetchData(){
      if(updateROIssued || loggedIn){
        const ROs = await API.getROIssued();
        setROIssued(ROs);
        setUpdateROIssued(false);
      }
    }
    fetchData();
  }, [updateROIssued, loggedIn]);

  //update RO
  useEffect(() => {
    async function fetchData(){
      if(updateRO || loggedIn){
        const ROs = await API.getRO();
        setRO(ROs);
        setUpdateRO(false);
      }
    }
    fetchData();
  }, [updateRO, loggedIn]);

  //update items
  useEffect(() => {
    async function fetchData(){
      if(updateItem || loggedIn){
        const itemList = await API.getItem();
        setItems(itemList);
        setUpdateItem(false);
      }
    }
    fetchData();
  }, [updateItem, loggedIn]);

  //FUNCTIONS
  //login
  const doLogIn = async (credentials, type) => {
    try {
      const user = await API.logIn(credentials, type);
      toast.success(
        `Welcome ${user.name} ${user.surname}!`,
        { position: "top-center" },
        { toastId: 1 }
      );
      setUserData(user);
      setLoggedIn(true);
    } catch (err) {
      toast.error(
        err,
        {
          position: "top-center",
        },
        { toastId: 10 }
      );
    }
  };

  //logout
  const doLogOut = async () => {
    await API.logOut()
      .then(() =>
        toast.success(
          "Logout Succeeded",
          { position: "top-center" },
          { toastId: 2 }
        )
      )
      .catch(() =>
        toast.error(
          "Error during logout, try again",
          {
            position: "top-center",
          },
          { toastId: 11 }
        )
      );
    setLoggedIn(false);
    setUserData();
    setUpdate(true);
  };

  //add position to system db
  const addPosition = (newPosition) => {
    const add = async () => {
      await API.addPosition(newPosition);
    };

    add()
      .then(() => {
        setUpdatePosition(true);
        toast.success(
          "Position added",
          { position: "top-center" },
          { toastId: 3 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 12 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 13 });
        }
      });
  };

  const editPosition = (newPosition) => {
    const add = async () => {
      await API.editPosition(newPosition);
    };

    add()
      .then(() => {
        setUpdatePosition(true);
        toast.success(
          "Position succesfully modified",
          { position: "top-center" },
          { toastId: 3 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 14 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 15 });
        }
      });
  };

  const deletePosition = (barcode) => {
    const add = async () => {
      await API.deletePosition(barcode);
    };

    add()
      .then(() => {
        setUpdatePosition(true);
        toast.success(
          "Position succesfully deleted",
          { position: "top-center" },
          { toastId: 4 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 16 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 17 });
        }
      });
  };

  const editPositionBarcode = (oldCode,newCode) => {
    const add = async () => {
      await API.editPositionBarcode(oldCode,newCode);
    };

    add()
      .then(() => {
        setUpdatePosition(true);
        toast.success(
          "Position's barcode succesfully modified",
          { position: "top-center" },
          { toastId: 5 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 18 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 19 });
        }
      });
  };

  //add SKU to system db
  const addSKU = (newSku) => {
    const add = async () => {
      await API.addSKU(newSku);
    };

    add()
      .then(() => {
        setUpdateSKU(true);
        setUpdatePosition(true);
        toast.success(
          "SKU added",
          { position: "top-center" },
          { toastId: 20 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 21 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 22 });
        }
      });
  };

  const editSKU = (id,newSku) => {
    const add = async () => {
      await API.editSKU(id,newSku);
    };

    add()
      .then(() => {
        setUpdateSKU(true);
        setUpdatePosition(true);
        toast.success(
          "SKU succesfully modified",
          { position: "top-center" },
          { toastId: 23 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 24 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 25 });
        }
      });
  };

  const deleteSKU = (id) => {
    const add = async () => {
      await API.deleteSKU(id);
    };

    add()
      .then(() => {
        setUpdateSKU(true);
        setUpdatePosition(true);
        toast.success(
          "SKU succesfully deleted",
          { position: "top-center" },
          { toastId: 26 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 27 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 28 });
        }
      });
  };

  const editSKUPosition = (id,barcode) => {
    const add = async () => {
      await API.editSKUPosition(id,barcode);
    };

    add()
      .then(() => {
        setUpdatePosition(true);
        setUpdateSKU(true);
        toast.success(
          "Position succesfully assigned to SKU",
          { position: "top-center" },
          { toastId: 29 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 30 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 31 });
        }
      });
  };


  const addTestDescriptor = (newTestDescriptor) => {
    const add = async () => {
      await API.addTestDescriptor(newTestDescriptor);
    };

    add()
      .then(() => {
        setUpdateTestDescriptor(true);
        toast.success(
          "Test Descriptor added",
          { position: "top-center" },
          { toastId: 32 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 33 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 34 });
        }
      });
  };

  const editTestDescriptor = (id,newTestDescriptor) => {
    const add = async () => {
      await API.editTestDescriptor(id,newTestDescriptor);
    };

    add()
      .then(() => {
        setUpdateTestDescriptor(true);
        toast.success(
          "Test Descriptor succesfully modified",
          { position: "top-center" },
          { toastId: 35 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 36 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 37 });
        }
      });
  };

  const deleteTestDescriptor = (id) => {
    const add = async () => {
      await API.deleteTestDescriptor(id);
    };

    add()
      .then(() => {
        setUpdateTestDescriptor(true);
        toast.success(
          "Test Descriptor succesfully deleted",
          { position: "top-center" },
          { toastId: 38 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 39 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 40 });
        }
      });
  };

  const addUser = (newUser) => {
    const add = async () => {
      await API.addUser(newUser);
    };

    add()
      .then(() => {
        setUpdateUser(true);
        toast.success(
          "User added",
          { position: "top-center" },
          { toastId: 41 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 42 });
        } else {
          toast.error(err, { position: "top-center" }, { toastId: 43 });
        }
      });
  };

  const editUser = (username,newUser) => {
    const add = async () => {
      await API.editUser(username,newUser);
    };

    add()
      .then(() => {
        setUpdateUser(true);
        toast.success(
          "User rights succesfully modified",
          { position: "top-center" },
          { toastId: 44 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 45 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 46 });
        }
      });
  };

  const deleteUser = (username,type) => {
    const add = async () => {
      await API.deleteUser(username,type);
    };

    add()
      .then(() => {
        setUpdateUser(true);
        toast.success(
          "User succesfully deleted",
          { position: "top-center" },
          { toastId: 47 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 48 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 49 });
        }
      });
  };

  //add IO to system db
  const addIO = (newIO) => {
    const add = async () => {
      await API.addIO(newIO);
      for (let sk of newIO.products){
        const sku = await API.getSingleSKU(sk.SKUId);
        const modifiedSku = {
          newDescription : sku.description,
          newWeight : sku.weight,
          newVolume : sku.volume,
          newNotes : sku.notes,
          newPrice : sku.price,
          newAvailableQuantity : sku.availableQuantity*1 - sk.qty*1
        }
        await API.editSKU(sku.id,modifiedSku);
      }
    };

    add()
      .then(() => {
        setUpdateSKU(true);
        setUpdatePosition(true);
        setUpdateIOIssued(true);
        toast.success(
          "Internal order ISSUED",
          { position: "top-center" },
          { toastId: 48 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 49 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 50 });
        }
      });
  };

  const editIO = (id,newIO) => {
    const add = async () => {
      await API.editIO(id,newIO);
      if(newIO.newState === "REFUSED" || newIO.newState === "CANCELED"){ 
        const IO = await API.getSingleIO(id);
        for (let sk of IO.products){
          const sku = await API.getSingleSKU(sk.SKUId);
          const modifiedSku = {
            newDescription : sku.description,
            newWeight : sku.weight,
            newVolume : sku.volume,
            newNotes : sku.notes,
            newPrice : sku.price,
            newAvailableQuantity : sku.availableQuantity*1 + sk.qty*1
          }
          await API.editSKU(sku.id,modifiedSku);
        }
      }
      else if (newIO.newState === "COMPLETED"){
        for (let skItm of newIO.products){
          const skuItem = await API.getSingleSKUItem(skItm.RFID);
          const modifiedSkuItem = {
            newRFID:skuItem.RFID,
            newAvailable:0,
            newDateOfStock:skuItem.DateOfStock

          }
          await API.editSKUItem(skuItem.RFID,modifiedSkuItem);
        }
      }
    };

    add()
      .then(() => {
        setUpdateSKU(true);
        setUpdateSKUItem(true);
        setUpdatePosition(true);
        setUpdateIOIssued(true);
        setUpdateIOAccepted(true);
        toast.success(
          "Internal order "+newIO.newState,
          { position: "top-center" },
          { toastId: 51 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 52 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 53 });
        }
      });
  };

  //add RO to system db
  const addRO = (newRO) => {
    const add = async () => {
      await API.addRO(newRO);
    };

    add()
      .then(() => {
        setUpdateRO(true);
        setUpdateROIssued(true);
        toast.success(
          "Restock order ISSUED",
          { position: "top-center" },
          { toastId: 54 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 55 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 56 });
        }
      });
  };

  const editRO = (id,newRO,RestockOrder) => {
    const add = async () => {
      if(newRO.newState === "COMPLETED"){
        for (let product of RestockOrder.skuItems){
          const skuitem = await API.getSingleSKUItem(product.rfid);
          if(skuitem.Available*1===0){
            newRO.newState = "COMPLETEDRETURN";
          }
          else{
            const sku = await API.getSingleSKU(skuitem.SKUId);
            const newSKU = {
              newDescription : sku.description,
              newWeight : sku.weight,
              newVolume : sku.volume,
              newNotes : sku.notes,
              newPrice : sku.price,
              newAvailableQuantity : sku.availableQuantity*1 +1
            }
            //Update availability of SKU
            await API.editSKU(skuitem.SKUId,newSKU);
          }
        }
      }

      await API.editRO(id,newRO);
      
      if(newRO.newState === "DELIVERY"){
        const date = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour : 'numeric', minute: 'numeric' };
        const deliveryDate = date.toLocaleString('ja-JP',options).replace(',','');
        await API.addTransportNoteRO(id,{transportNote:{deliveryDate: deliveryDate}});
        }
      else if(newRO.newState === "DELIVERED"){
        //Creation of SKU ITEMS
        let skuItms = [];
        let RF= newRFID;
        for(let product of RestockOrder.products){
          for(let i=0;i<product.qty*1;i++){
            const SKUItem = {
              RFID : RF,
              SKUId : product.SKUId,
              DateOfStock: null
            }
            await API.addSKUItem(SKUItem);
            RF = zeroPad(RF*1 +1,32);
            skuItms.push({SKUId:SKUItem.SKUId,itemId:product.itemId,rfid: SKUItem.RFID});
          }
        }
        setNewRFID(RF);
        //Add Sku Items to RO
        await API.addSkuItemsRO(id,{skuItems:skuItms});
      }
    };

    add()
      .then(() => {
        setUpdateROIssued(true);
        setUpdateRO(true);
        setUpdatePosition(true);
        setUpdateSKUItem(true);
        toast.success(
          "Restock order "+newRO.newState,
          { position: "top-center" },
          { toastId: 54 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 55 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 56 });
        }
      });
  };

  const addTestResult = (newTR) => {
    const add = async () => {
      await API.addTestResult(newTR);
    };

    add()
      .then(() => {
        
        toast.success(
          "Test Result Added",
          { position: "top-center" },
          { toastId: 57 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 58 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 59 });
        }
      });
  };

  const stockItem = (rfid) => {
    const add = async () => {
      const tests = await API.getTestResults(rfid);
      const item = await API.getSingleSKUItem(rfid);
      let notStock=0;
      for (let test of tests){
        
        if(test.Result === false){
          
          notStock=1;
          }
      }
      if(notStock*1===1){
        const skuitem = {
          newRFID:item.RFID,
          newAvailable:0,
          newDateOfStock:null
        }
        await API.editSKUItem(rfid,skuitem);
      }
      else{
        const date = new Date();
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour : 'numeric', minute: 'numeric' };
        const stockDate = date.toLocaleString('ja-JP',options).replace(',','');
        const skuitem = {
            newRFID:item.RFID,
            newAvailable:1,
            newDateOfStock:stockDate
          
        }
        await API.editSKUItem(rfid,skuitem);
      }
    };

    add()
      .then(() => {
        setUpdateSKUItem(true);
        setUpdatePosition(true);
        setUpdateSKU(true);
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 60 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 61 });
        }
      });
  };

  //add REO to system db
  const addREO = (newREO,idRestockOrder) => {
    const add = async () => {
      for (let product of newREO.products){
        const skuitem = await API.getSingleSKUItem(product.RFID);
        //If skuitem was available, then reduce availability of SKU
        if(skuitem.Available*1 === 1){
            const sku = await API.getSingleSKU(skuitem.SKUId);
            const newSKU = {
                  newDescription : sku.description,
                  newWeight : sku.weight,
                  newVolume : sku.volume,
                  newNotes : sku.notes,
                  newPrice : sku.price,
                  newAvailableQuantity : sku.availableQuantity*1 -1
                }
            //Update availability of SKU
            await API.editSKU(skuitem.SKUId,newSKU);
          }
        const newSkuItem = {
          newRFID: skuitem.RFID,
          newAvailable: 0,
          newDateOfStock: null
        }
        await API.editSKUItem(skuitem.RFID,newSkuItem);
      }
      await API.addREO(newREO);
      await API.editRO(idRestockOrder,{newState:"COMPLETED"});
    };

    add()
      .then(() => {
        setUpdateRO(true);
        setUpdateSKU(true);
        setUpdatePosition(true);
        setUpdateSKUItem(true);
        toast.success(
          "Return order ISSUED",
          { position: "top-center" },
          { toastId: 62 }
        );
        toast.success(
          "Restock order COMPLETED",
          { position: "top-center" },
          { toastId: 63 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 64 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 65 });
        }
      });
  };

  //add Item to system db
  const addItem = (newItem) => {
    const add = async () => {
      await API.addItem(newItem);
    };

    add()
      .then(() => {
        setUpdateItem(true);
        toast.success(
          "Item added",
          { position: "top-center" },
          { toastId: 66 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 67 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 68 });
        }
      });
  };

  const editItem = (id,newItem) => {
    const add = async () => {
      await API.editItem(id,newItem);
    };

    add()
      .then(() => {
        setUpdateItem(true);
        toast.success(
          "Item succesfully modified",
          { position: "top-center" },
          { toastId: 69 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 70 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 71 });
        }
      });
  };

  const deleteItem = (id) => {
    const add = async () => {
      await API.deleteItem(id);
    };

    add()
      .then(() => {
        setUpdateItem(true);
        toast.success(
          "Item succesfully deleted",
          { position: "top-center" },
          { toastId: 72 }
        );
      })
      .catch((err) => {
        if (err.errors && err.errors[0]) {
          toast.error(err.errors[0].msg, { position: "top-center" }, { toastId: 73 });
        } else {
          toast.error(err.error, { position: "top-center" }, { toastId: 74 });
        }
      });
  };


 



  //ROUTES

  return (
    <div className="page">
    <Router>
        <ToastContainer />
        <NavbarCustom
          className="width100 navbar navbar-dark navbar-expand-sm bg-success fixed-top"
          logged={loggedIn}
          logout={doLogOut}
          user={userdata}
          
        />
        <Switch>
        <Route //login
            exact
            path="/login"
            render={() => {
              if (loggedIn) {
                switch (userdata.type) {
                  case "C":
                    return (
                      <>
                        <Redirect to="/customer" />;
                      </>
                    );
                  case "M":
                    return (
                      <>
                        <Redirect to="/manager" />;
                      </>
                    );
                  case "S":
                    return (
                      <>
                        <Redirect to="/supplier" />;
                      </>
                    );
                  case "K":
                    return (
                      <>
                        <Redirect to="/clerk" />;
                      </>
                    );
                  case "Q":
                    return (
                      <>
                        <Redirect to="/qualityEmployee" />;
                      </>
                    );
                  case "D":
                    return (
                      <>
                        <Redirect to="/deliveryEmployee" />;
                      </>
                    );
                  default:
                    return (
                      <>
                        <Redirect to="/" />;
                      </>
                    );
                }
              } else {
                return (
                  <>
                    <Login handleSubmit={doLogIn} />
                  </>
                );
              }
            }}
          />

        {/*<Route
            path="/register"
            exact
            render={() => (
              
                  <>
                    {loggedIn ? (
                      <>
                        <Redirect to="/home" />
                      </>
                      ):(  
                          <>
                            <NewUserForm className="below-nav main-content" addUser={addUser} manager={false}/>
                          </>
                        )}
                    </>)}
                      
                      />*/}

          <Route
            path="/showItems"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <ShowItem className="below-nav main-content" suppliers={suppliers} items={items}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />  

          <Route
            path="/deleteItem"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "S" ? (
                          <>
                            <DeleteItem className="below-nav main-content" deleteItem={deleteItem} items={items.filter((i)=>i.supplierId*1===userdata.id)}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />  

        <Route
            path="/editItem"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "S" ? (
                          <>
                            <NewEditItem className="below-nav main-content" editItem={editItem} skus={skus} items={items.filter((i)=>i.supplierId*1===userdata.id)} supplierId={userdata.id} edit={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />


          <Route
            path="/createItem"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "S" ? (
                          <>
                            <NewEditItem className="below-nav main-content" addItem={addItem} skus={skus} items={items} supplierId={userdata.id} edit={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deliverIO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "D" ? (
                          <>
                            <DeliverIO className="below-nav main-content" editIO={editIO} skuItems={SKUItems} IOAccepted={IOAccepted}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/createREO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewReturnOrder className="below-nav main-content" addREO={addREO} RO={RO.filter((r)=>r.state==="COMPLETEDRETURN")}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/stockRO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "K" ? (
                          <>
                            <StockRO className="below-nav main-content" editRO={editRO} stockItem={stockItem} RO={RO.filter((r)=>r.state==="TESTED")}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/testRO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "Q" ? (
                          <>
                            <TestRO className="below-nav main-content" addTestResult={addTestResult} editRO={editRO} RO={RO.filter((r)=>r.state==="DELIVERED")} testDescriptors={testDescriptors}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/acceptRO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "K" ? (
                          <>
                            <AcceptRO className="below-nav main-content" editRO={editRO} RO={RO.filter((r)=>r.state==="DELIVERY")}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deliverRO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "S" ? (
                          <>
                            <DeliverRO className="below-nav main-content" editRO={editRO} ROIssued={ROIssued.filter((r)=>r.supplierId*1 === userdata.id*1)}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/createRO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewRestockOrder className="below-nav main-content" addRO={addRO} skus={skus} suppliers={suppliers} items={items}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/editIO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <AcceptCancelRejectIO className="below-nav main-content" editIO={editIO} IOIssued={IOIssued} manager={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/cancelIO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "C" ? (
                          <>
                            <AcceptCancelRejectIO className="below-nav main-content" editIO={editIO} IOIssued={IOIssued.filter((i)=>i.customerId*1 === userdata.id*1)} manager={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/createIO"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "C" ? (
                          <>
                            <NewInternalOrder className="below-nav main-content" addIO={addIO} skus={skus} customerId={userdata.id}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deleteUser"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditDeleteUser className="below-nav main-content" deleteUser={deleteUser} users={users} delete={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />  

        <Route
            path="/editUser"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditDeleteUser className="below-nav main-content" editUser={editUser} users={users} delete={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/createUser"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewUserForm className="below-nav main-content" addUser={addUser} manager={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deleteTestDescriptor"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <DeleteTestDescriptor className="below-nav main-content" deleteTestDescriptor={deleteTestDescriptor} testDescriptors={testDescriptors}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />  

        <Route
            path="/editTestDescriptor"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewEditTestDescriptor className="below-nav main-content" editTestDescriptor={editTestDescriptor} skus={skus} testDescriptors={testDescriptors} edit={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />


          <Route
            path="/createTestDescriptor"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewEditTestDescriptor className="below-nav main-content" addTestDescriptor={addTestDescriptor} skus={skus} testDescriptors={testDescriptors} edit={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deleteSKU"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditPositionDeleteSKU className="below-nav main-content" deleteSKU={deleteSKU} skus={skus} positions={positions} delete={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/editSKUPosition"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditPositionDeleteSKU className="below-nav main-content" editSKUPosition={editSKUPosition} positions={positions} skus={skus} delete={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

        <Route
            path="/editSKU"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewEditSKU className="below-nav main-content" editSKU={editSKU} skus={skus} edit={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />


          <Route
            path="/createSKU"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewEditSKU className="below-nav main-content" addSKU={addSKU} skus={skus} edit={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deletePosition"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditDeleteBarcodePosition className="below-nav main-content" deletePosition={deletePosition} positions={positions} delete={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/editBarcodePosition"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <EditDeleteBarcodePosition className="below-nav main-content" editPositionBarcode={editPositionBarcode} positions={positions} delete={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/editPosition"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewPosition className="below-nav main-content" editPosition={editPosition} positions={positions} edit={true}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />


          <Route
            path="/createPosition"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <NewPosition className="below-nav main-content" addPosition={addPosition} positions={positions} edit={false}/>
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/customer"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "C" ? (
                          <>
                            <Customer className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/manager"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "M" ? (
                          <>
                            <Manager className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/supplier"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "S" ? (
                          <>
                            <Supplier className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/clerk"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "K" ? (
                          <>
                            <Clerk className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/qualityEmployee"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "Q" ? (
                          <>
                            <QualityEmployee className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />

          <Route
            path="/deliveryEmployee"
            exact
            render={() => (
              <>
                {update ? (
                  <>
                    {loggedIn ? (
                      <>
                        {userdata.id && userdata.type === "D" ? (
                          <>
                             <DeliveryEmployee className="below-nav main-content" />
                          </>
                        ) : (
                          <>
                            <Redirect to="/home" />
                          </>
                        )}
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}{" "}
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          />


          <Route //homepage
            exact
            path="/home"
            render={() => (
              <div className="width100 below-nav text-center">
                  <h1>Welcome to EZWH!</h1> <br />
                  <LoginButton loggedIn={loggedIn}></LoginButton>
                
              </div>
            )}
          />

          <Route
            path="/*"
            render={() => (
              <>
                <Redirect to="/home" />
              </>
            )}
          />

        </Switch>
    </Router>
    </div>
  );
}

export default App;
