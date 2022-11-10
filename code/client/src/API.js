async function logIn(credentials, type) {
    //call: POST /api/...
    let response = null;
    switch (type) {
      case "C":
        response = await fetch("/api/customerSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      case "M":
        response = await fetch("/api/managerSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      case "S":
        response = await fetch("/api/supplierSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      case "K":
        response = await fetch("/api/clerkSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      case "Q":
        response = await fetch("/api/qualityEmployeeSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      case "D":
        response = await fetch("/api/deliveryEmployeeSessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        break;
      default:
        //error: 
        console.log("How did you get that?");
        return null;
    }
    if (response.ok) {
      console.log("client: login returned ok from server");
      let user = await response.json();
      user.type = type;
      return user;
    } else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      } catch (err) {
        throw err;
      }
    }
  }
  
  async function logOut() {
    await fetch("/api/logout", { method: "POST" });
  }
  
  async function getUserInfo() {
    const response = await fetch("/api/userinfo");
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo; // an object with the error coming from the server
    }
  }

  function addPosition(newPosition) {
    // call: POST /api/position
    return new Promise((resolve, reject) => {
      fetch("/api/position", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPosition),
      })
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            response
              .json()
              .then((obj) => {
                reject(obj);
              }) // error msg in the response body
              .catch((err) => {
                reject({
                  errors: [
                    { param: "Application", msg: "Cannot parse server response" },
                  ],
                });
              }); // something else
          }
        })
        .catch((err) => {
          reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
        }); // connection errors
    });
  }

  const getPositions = async () => {
    // call: GET /api/positions
    const response = await fetch("/api/positions");
    const positions = await response.json();
    if (response.ok) {
      return positions;
    }
  };

  function editPositionBarcode(oldCode,newCode) {
    // call: PUT /api/position
    return new Promise((resolve, reject) => {
      fetch("/api/position/"+oldCode+"/changeID", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({newPositionID:newCode}),
      })
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            response
              .json()
              .then((obj) => {
                reject(obj);
              }) // error msg in the response body
              .catch((err) => {
                reject({
                  errors: [
                    { param: "Application", msg: "Cannot parse server response" },
                  ],
                });
              }); // something else
          }
        })
        .catch((err) => {
          reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
        }); // connection errors
    });
  }

  function editPosition(newPosition) {
    // call: PUT /api/position
    return new Promise((resolve, reject) => {
      fetch("/api/position/"+newPosition.positionID, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPosition),
      })
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            response
              .json()
              .then((obj) => {
                reject(obj);
              }) // error msg in the response body
              .catch((err) => {
                reject({
                  errors: [
                    { param: "Application", msg: "Cannot parse server response" },
                  ],
                });
              }); // something else
          }
        })
        .catch((err) => {
          reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
        }); // connection errors
    });
  }

  function deletePosition(barcode){
    return new Promise((resolve, reject) => {
      fetch("/api/position/"+barcode, {
        method: "DELETE"
      })
        .then((response) => {
          if (response.ok) {
            resolve(true);
          } else {
            response
              .json()
              .then((obj) => {
                reject(obj);
              }) // error msg in the response body
              .catch((err) => {
                reject({
                  errors: [
                    { param: "Application", msg: "Cannot parse server response" },
                  ],
                });
              }); // something else
          }
        })
        .catch((err) => {
          reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
        }); // connection errors
    });
}

const getSKU = async () => {
  // call: GET /api/skus
  const response = await fetch("/api/skus");
  const skus = await response.json();
  if (response.ok) {
    return skus;
  }
};

const getSingleSKU = async (id) => {
  // call: GET /api/skus/:id
  const response = await fetch("/api/skus/"+id);
  const sku = await response.json();
  if (response.ok) {
    return sku;
  }
};


function addSKU(newSku) {
  // call: POST /api/sku
  return new Promise((resolve, reject) => {
    fetch("/api/sku", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSku),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editSKU(id,newSKU) {
  // call: PUT /api/sku/:id
  return new Promise((resolve, reject) => {
    fetch("/api/sku/"+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSKU),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function deleteSKU(id){
  return new Promise((resolve, reject) => {
    fetch("/api/skus/"+id, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editSKUPosition(id,barcode) {
  // call: PUT /api/sku/:id/position
  return new Promise((resolve, reject) => {
    fetch("/api/sku/"+id+"/position", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({position:barcode}),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getTestDescriptors = async () => {
  // call: GET /api/testDescriptors
  const response = await fetch("/api/testDescriptors");
  const testDescriptors = await response.json();
  if (response.ok) {
    return testDescriptors;
  }
};

function addTestDescriptor(newTestDescriptor) {
  // call: POST /api/testDescriptor
  return new Promise((resolve, reject) => {
    fetch("/api/testDescriptor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTestDescriptor),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editTestDescriptor(id,newTestDescriptor) {
  // call: PUT /api/testDescriptor/:id
  return new Promise((resolve, reject) => {
    fetch("/api/testDescriptor/"+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTestDescriptor),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function deleteTestDescriptor(id){
  return new Promise((resolve, reject) => {
    fetch("/api/testDescriptor/"+id, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getUsers = async () => {
  // call: GET /api/users
  const response = await fetch("/api/users");
  const users = await response.json();
  if (response.ok) {
    return users;
  }
};

const getSuppliers = async () => {
  // call: GET /api/suppliers
  const response = await fetch("/api/suppliers");
  const suppliers = await response.json();
  if (response.ok) {
    return suppliers;
  }
};

function addUser(newUser) {
  // call: POST /api/newUser
  return new Promise((resolve, reject) => {
    fetch("/api/newUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editUser(username,newUser) {
  // call: PUT /api/users/:username
  return new Promise((resolve, reject) => {
    fetch("/api/users/"+username, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function deleteUser(username,type){
  return new Promise((resolve, reject) => {
    fetch("/api/users/"+username+"/"+type, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getIOIssued = async () => {
  // call: GET /api/internalOrdersIssued
  const response = await fetch("/api/internalOrdersIssued");
  const IOs = await response.json();
  if (response.ok) {
    return IOs;
  }
};

const getIOAccepted = async () => {
  // call: GET /api/internalOrdersAccepted
  const response = await fetch("/api/internalOrdersAccepted");
  const IOs = await response.json();
  if (response.ok) {
    return IOs;
  }
};

const getSingleIO = async (id) => {
  // call: GET /api/internalOrders/:id
  const response = await fetch("/api/internalOrders/"+id);
  const IO = await response.json();
  if (response.ok) {
    return IO;
  }
};

function addIO(newIO) {
  // call: POST /api/internalOrders
  return new Promise((resolve, reject) => {
    fetch("/api/internalOrders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editIO(id,newIO) {
  // call: PUT /api/internalOrders/:id
  return new Promise((resolve, reject) => {
    fetch("/api/internalOrders/"+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getROIssued = async () => {
  // call: GET /api/restockOrdersIssued
  const response = await fetch("/api/restockOrdersIssued");
  const ROs = await response.json();
  if (response.ok) {
    return ROs;
  }
};

const getRO = async () => {
  // call: GET /api/restockOrders
  const response = await fetch("/api/restockOrders");
  const ROs = await response.json();
  if (response.ok) {
    return ROs;
  }
};

function addRO(newRO) {
  // call: POST /api/restockOrder
  return new Promise((resolve, reject) => {
    fetch("/api/restockOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editRO(id,newRO) {
  // call: PUT /api/restockOrder/:id
  return new Promise((resolve, reject) => {
    fetch("/api/restockOrder/"+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function addTransportNoteRO(id,newRO) {
  // call: PUT /api/restockOrder/:id/transportNote
  return new Promise((resolve, reject) => {
    fetch("/api/restockOrder/"+id+"/transportNote", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getSKUItems = async () => {
  // call: GET /api/skuitems
  const response = await fetch("/api/skuitems");
  const SKUItems = await response.json();
  if (response.ok) {
    return SKUItems;
  }
};

function addSKUItem(newSkuItem) {
  // call: POST /api/skuitem
  return new Promise((resolve, reject) => {
    fetch("/api/skuitem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSkuItem),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getSingleRO = async (id) => {
  // call: GET /api/restockOrders/:id
  const response = await fetch("/api/restockOrders/"+id);
  const RO = await response.json();
  if (response.ok) {
    return RO;
  }
};

function addSkuItemsRO(id,newRO) {
  // call: PUT /api/restockOrder/:id/skuItems
  return new Promise((resolve, reject) => {
    fetch("/api/restockOrder/"+id+"/skuItems", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function addTestResult(newTestResult) {
  // call: POST /api/skuitems/testResult
  return new Promise((resolve, reject) => {
    fetch("/api/skuitems/testResult", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTestResult),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getTestResults = async (rfid) => {
  // call: GET /api/skuitems/:rfid/testResults
  const response = await fetch("/api/skuitems/"+rfid+"/testResults");
  const TestResults = await response.json();
  if (response.ok) {
    return TestResults;
  }
};

const getSingleSKUItem = async (rfid) => {
  // call: GET /api/skuitems/:rfid
  const response = await fetch("/api/skuitems/"+rfid);
  const item = await response.json();
  if (response.ok) {
    return item;
  }
};

function editSKUItem(rfid,newSKUItem) {
  // call: PUT /api/skuitems/:rfid
  return new Promise((resolve, reject) => {
    fetch("/api/skuitems/"+rfid, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSKUItem),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getSKUItemsToReturn = async (id) => {
  // call: GET /api/restockOrders/:id/returnItems
  const response = await fetch("/api/restockOrders/"+id+"/returnItems");
  const items = await response.json();
  if (response.ok) {
    return items;
  }
};

function addREO(newREO) {
  // call: POST /api/returnOrder
  return new Promise((resolve, reject) => {
    fetch("/api/returnOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newREO),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

const getItem = async () => {
  // call: GET /api/items
  const response = await fetch("/api/items");
  const items = await response.json();
  if (response.ok) {
    return items;
  }
};

function addItem(newItem) {
  // call: POST /api/item
  return new Promise((resolve, reject) => {
    fetch("/api/item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function editItem(id,newItem) {
  // call: PUT /api/item/:id
  return new Promise((resolve, reject) => {
    fetch("/api/item/"+id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

function deleteItem(id){
  return new Promise((resolve, reject) => {
    fetch("/api/items/"+id, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response
            .json()
            .then((obj) => {
              reject(obj);
            }) // error msg in the response body
            .catch((err) => {
              reject({
                errors: [
                  { param: "Application", msg: "Cannot parse server response" },
                ],
              });
            }); // something else
        }
      })
      .catch((err) => {
        reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] });
      }); // connection errors
  });
}

  const API = {
    logIn,
    logOut,
    getUserInfo,
    addPosition,
    getPositions,
    editPosition,
    editPositionBarcode,
    deletePosition,
    getSKU,
    getSingleSKU,
    addSKU,
    editSKU,
    deleteSKU,
    editSKUPosition,
    getTestDescriptors,
    addTestDescriptor,
    editTestDescriptor,
    deleteTestDescriptor,
    getUsers,
    addUser,
    editUser,
    deleteUser,
    getIOIssued,
    getIOAccepted,
    addIO,
    editIO,
    getSingleIO,
    getSuppliers,
    getSingleRO,
    getROIssued,
    getRO,
    addRO,
    editRO,
    addTransportNoteRO,
    getSKUItems,
    addSKUItem,
    addSkuItemsRO,
    addTestResult,
    getTestResults,
    getSingleSKUItem,
    editSKUItem,
    getSKUItemsToReturn,
    addREO,
    getItem,
    addItem,
    editItem,
    deleteItem
    
  };
  export default API;