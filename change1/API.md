# List of API

Version: 1.1

Date: 04 May 2022

| Change | Description |
|---|------|
| <b>Fix issue</b> | NEW API: ITEM<br>GET<br>/api/items/:id/:supplierId (NEW API, instead of /api/items/:id)<br>PUT<br>/api/item/:id/:supplierId (NEW API, instead of /api/item/:id)<br>DELETE<br> /api/items/:id/:supplierId  (NEW API, instead of /api/items/:id) |
|<b>Change1</b>| <b>Api that changes</b> <br> <b>RESTOCK ORDER</b> <br> GET <br> /api/restockOrders <br>  /api/restockOrdersIssued <br> /api/restockOrders/:id <br> /api/restockOrders/:id/returnItems <br> POST <br> /api/restockOrder <br> PUT <br> /api/restockOrder/:id/skuItems <br> <b>RETURN ORDER</b> <br> GET <br> /api/returnOrders <br> /api/returnOrders/:id <br> POST <br> /api/returnOrder <br>  |
| issue 2 | fixed comment, 'delete a position receiving its positionId |
| issue 11 | fixed POST /api/item,  now receives both SKU.id and Item.id |

## INDEX
[SKU](#sku)

[SKU Item](#sku-item)

[Position](#position)

[Test descriptor](#test-descriptor)

[Test result](#test-result)

[User](#user)

[Restock order](#restock-order)

[Return order](#return-order)

[Internal order](#internal-order)

[Item](#item)

## SKU

### GET

#### **/api/skus**

- **Return an array containing all SKUs**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, description, weight, volume, notes position, available Quantity, price and a list of testDescriptors of a SKU

    ```
    [
        {
            "id":1,
           "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "800234523412",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : [1,3,4]
        },
        {
            "id":2,
           "description" : "another sku",
            "weight" : 101,
            "volume" : 60,
            "notes" : "second SKU",
            "position" : "800234543412",
            "availableQuantity" : 55,
            "price" : 10.99,
            "testDescriptors" : [2,5,7]
        },
        ....
    ]

    ```


- **Permissions allowed**:  Manager, Customer, Clerk
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/skus/:id**

- **Return a SKU, given its id**.
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the SKU

    
        {
           "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "position" : "800234523412",
            "availableQuantity" : 50,
            "price" : 10.99,
            "testDescriptors" : [1,3,4]
        }

- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no SKU associated to id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/sku**

- **Creates a new SKU with an empty array of testDescriptors.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing description, weight, volume, notes, price and availableQuantity.
 Example of Request body

    ```
        {
            "description" : "a new sku",
            "weight" : 100,
            "volume" : 50,
            "notes" : "first SKU",
            "price" : 10.99,
            "availableQuantity" : 50
        }
    ```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).


### PUT

#### **/api/sku/:id**

- **Modify an existing SKU. When a newAvailableQuantity is sent, occupiedWeight and occupiedVolume fields of the position (if the SKU is associated to a position) are modified according to the new available quantity.**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object containing id and new description, new weight, new volume, new notes, new Price and newAvailableQuantity, newTestDescriptors.
If some fields doesn't change, send the old value.

Example of Request body

    {
        "newDescription" : "a new sku",
        "newWeight" : 100,
        "newVolume" : 50,
        "newNotes" : "first SKU",
        "newPrice" : 10.99,
        "newAvailableQuantity" : 50
    }

- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not found` (SKU not existing), `422 Unprocessable Entity` (validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume), `503 Service Unavailable` (generic error).

#### **/api/sku/:id/position**

- **Add or modify position of a SKU. When a SKU is associated to a position, occupiedWeight and occupiedVolume fields of the position are modified according to the available quantity.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing position.

Example of Request body:

    {
        "position": "800234523412"
    }

- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not found` (Position not existing or SKU not existing), `422 Unprocessable Entity` (validation of position through the algorithm failed or position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/skus/:id**

- **Delete a SKU receiving its id.**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).

## SKU ITEM

### GET

#### **/api/skuitems**

- **Return an array containing all SKU items**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing RFID, SKUId, Available and Date of Stock of a SKU item

    ```
        [
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "Available":0,
                "DateOfStock":"2021/11/29 12:30",
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "Available":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            ....
        ]
    ```


- **Permissions allowed**:  Manager
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/skuitems/sku/:id**

- **Return an array containing all SKU items for a certain SKUId with Available = 1**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing RFID, SKUId and Date of Stock of a SKU item

    ```
        [
            {
                "RFID":"12345678901234567890123456789014",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "DateOfStock":"2021/11/29 12:30"
            },
            ....
        ]
    ```


- **Permissions allowed**:  Manager, Customer
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no SKU associated to id), `422 Unprocessable Entity` (validation of id failed) `500 Internal Server Error` (generic error).

#### **/api/skuitems/:rfid**

- **Return a SKU item, given its RFID**.
- **Request header** : req.params.rfid to retrieve rfid
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the SKU item

    ```
            {
                "RFID":"12345678901234567890123456789015",
                "SKUId":1,
                "Available":1,
                "DateOfStock":"2021/11/29 12:30"
            }
    ```


- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no SKU Item associated to rfid), `422 Unprocessable Entity` (validation of rfid failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/skuitem**

- **Creates a new SKU item with Available =0.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing RFID, SKUId and DateOfStock. DateOfStock can be null, in the format "YYYY/MM/DD" or in format "YYYY/MM/DD HH:MM"
 Example of Request body

```
    {
            "RFID":"12345678901234567890123456789015",
            "SKUId":1,
            "DateOfStock":"2021/11/29 12:30"
    }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Clerk
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no SKU associated to SKUId) `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).

### PUT

#### **/api/skuitems/:rfid**

- **Modify RFID, available and date of stock fields of an existing SKU Item.**
- **Request header** has a line: `Content-Type: application/json` and req.params.rfid to retrieve rfid.
- **Request body**: a JSON object containing new RFID, newAvailable and newDateOfStock. If only one field needs to be modified, the other one will contain the old value. newDateOfStock can be null, in the format "YYYY/MM/DD" or in format "YYYY/MM/DD HH:MM"

```
    {
        "newRFID":"12345678901234567890123456789015",
        "newAvailable":1,
        "newDateOfStock":"2021/11/29 12:30"
    }
```

- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no SKU Item associated to rfid), `422 Unprocessable Entity` (validation of request body or of rfid failed), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/skuitems/:rfid**

- **Delete a SKU item receiving his rfid.**
- **Request header** : req.params.rfid to retrieve rfid
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of rfid failed), `503 Service Unavailable` (generic error).


## POSITION

### GET

#### **/api/positions**

- **Return an array containing all positions**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing positionID,aisleID, row, col, maxWeight, maxVolume, occupiedWeight and occupiedVolume of a position

```
    [
        {
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 300,
            "occupiedVolume":150
        },
        {
            "positionID":"801234543412",
            "aisleID": "8012",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000,
            "occupiedWeight": 300,
            "occupiedVolume":150
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Clerk
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

### POST

#### **/api/position**

- **Creates a new Position.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing positionID,aisleID, row, col, maxWeight and maxVolume. By default occupiedWeight and occupiedVolume are setted to 0. aisleID, row and col are strings of 4 digits. positionID is derived from aisleID,row and col.

Example of Request body
    
```
        {
            "positionID":"800234543412",
            "aisleID": "8002",
            "row": "3454",
            "col": "3412",
            "maxWeight": 1000,
            "maxVolume": 1000
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).

### PUT
#### **/api/position/:positionID**

- **Modify a position identified by positionID.**
- **Request header** has a line: `Content-Type: application/json` and req.params.positionID to retrieve positionID.
- **Request body**: a JSON object with newAisleID, newRow, newCol,newMaxWeight, newMaxVolume, newOccupiedWeight and newOccupiedVolume. This updates also positionID.
    
```
        {
            "newAisleID": "8002",
            "newRow": "3454",
            "newCol": "3412",
            "newMaxWeight": 1200,
            "newMaxVolume": 600,
            "newOccupiedWeight": 200,
            "newOccupiedVolume":100
        }
```

        
- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Clerk
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no position associated to positionID), `422 Unprocessable Entity` (validation of request body or of positionID failed), `503 Service Unavailable` (generic error).

#### **/api/position/:positionID/changeID**

- **Modify the positionID of a position position, given its old positionID.**
- **Request header** has a line: `Content-Type: application/json` and req.params.positionID to retrieve positionID.
- **Request body**: a JSON object with new positionID. This updates also aisleID,row and col
    
```
        {
            "newPositionID": "800234543412"
        }
```

        
- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no position associated to positionID), `422 Unprocessable Entity` (validation of request body or of positionID failed), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/position/:positionID**

- **Delete a position receiving its positionID.**
- **Request header** : req.params.positionID to retrieve positionID
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of positionID failed), `503 Service Unavailable` (generic error).


## TEST DESCRIPTOR

### GET

#### **/api/testDescriptors**
- **Return an array containing all test descriptors**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, name, procedureDescription and idSKU of a test descriptor

```
    [
        {
            "id":1,
            "name":"test descriptor 1",
            "procedureDescription": "This test is described by...",
            "idSKU" :1

        },
        {
            "id":2,
            "name":"test descriptor 2",
            "procedureDescription": "This test is described by...",
            "idSKU" :2
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/testDescriptors/:id**

- **Return a test descriptor, given its id**.
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the test descriptor
  
```
        {
            "id":1,
            "name":"test descriptor 1",
            "procedureDescription": "This test is described by...",
            "idSKU" :1
        }
```


- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no test descriptor associated id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/testDescriptor**

- **Creates a new test descriptor.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing name, procedureDescription and idSKU.
    
```
        {
            "name":"test descriptor 3",
            "procedureDescription":"This test is described by...",
            "idSKU" :1
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no sku associated idSKU),`422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).

### PUT
#### **/api/testDescriptor/:id**

- **Modify a testDescriptor, given its id.**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object with new name, new procedureDescription and newIdSKU. If some fields don't change, send the old value.
    
```
        {
            "newName":"test descriptor 1",
            "newProcedureDescription":"This test is described by...",
            "newIdSKU" :1
        }
```

        
- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no test descriptor associated id or no sku associated to IDSku), `422 Unprocessable Entity` (validation of request body or of id failed), `503 Service Unavailable` (generic error).


### DELETE

#### **/api/testDescriptor/:id**
        
- **Delete a test descriptor, given its id.**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).


## TEST RESULT

### GET

#### **/api/skuitems/:rfid/testResults**

- **Return an array containing all test results for a certain sku item identified by RFID**.
- **Request header**: req.params.rfid to retreive rfid of SKU Item.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, idTestDescriptor, Date and Result of a test result

```
    [
        {
            "id":1,
            "idTestDescriptor":14,
            "Date":"2021/11/29",
            "Result": false
        },
        {
            "id":2,
            "idTestDescriptor":12,
            "Date":"2021/11/29",
            "Result": true
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), 404 Not Found` (no sku item associated to rfid) `,422 Unprocessable Entity` (validation of rfid failed), `500 Internal Server Error` (generic error).

#### **/api/skuitems/:rfid/testResults/:id**

- **Return  a single test result for a certain sku item identified by RFID.**
- **Request header** : req.params.id to retrieve id of test result, req.params.rfid to retreive rfid of sku item
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the test result    

```
        {
            "id":2,
            "idTestDescriptor":12,
            "Date":"2021/11/29",
            "Result": true
        }
```


- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no test result associated to id or no sku item associated to rfid), `422 Unprocessable Entity` (validation of id or of rfid failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/skuitems/testResult**

- **Creates a new test Result for a certain sku item identified by RFID.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing idTestDescriptor, Date and Result.
    
```
        {
            "rfid":"12345678901234567890123456789016",
            "idTestDescriptor":12,
            "Date":"2021/11/28",
            "Result": true
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),404 Not Found` (no sku item associated to rfid or no test descriptor associated to idTestDescriptor) ` ,422 Unprocessable Entity` (validation of request body or of rfid failed), `503 Service Unavailable` (generic error).

### PUT
#### **/api/skuitems/:rfid/testResult/:id**

- **Modify a test Result identified by id for a certain sku item identified by RFID.**
- **Request header** has a line: `Content-Type: application/json` , req.params.rfid to retrieve rfid of sku item and req.params.id to retrieve id of test result
- **Request body**: a JSON object with new testDescriptor, newDate and newResult.
    
```
        {
            "newIdTestDescriptor":12,
            "newDate":"2021/11/28",
            "newResult": true
        }
```

        
- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), 404 Not Found` (no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id) ` , `422 Unprocessable Entity` (validation of request body, of id or of rfid failed), `503 Service Unavailable` (generic error).



### DELETE

#### **/api/skuitems/:rfid/testResult/:id**

- **Delete a test result, given its id for a certain sku item identified by RFID.**
- **Request header** : req.params.id to retrieve id of test resutl, req.params.rfid to retreive rfid of sku item
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager, Quality Employee
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id or of rfid failed), `503 Service Unavailable` (generic error).

## USER

### GET

#### **/api/userinfo**
  - **Returns user informations if logged in.**
  - **Request body:** empty.
  - **Response:** `200 Ok` (success)  
  - **Response body:** user info (id, username, name, surname, type).
  - **Error responses:** `401 Unauthorized` (not logged in) or `500 Internal Server Error` (generic error).


#### **/api/suppliers**

- **Return an array containing all suppliers**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, name, surname and email of a supplier

```
    [{
        "id":1,
        "name":"John",
        "surname":"Snow",
        "email":"john.snow@supplier.ezwh.com"
    },{
        "id":2,
        "name":"Michael",
        "surname":"Jordan",
        "email":"michael.jordan@supplier.ezwh.com"
    },...]
```


- **Permissions allowed**:  Manager
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).


#### **/api/users**

- **Return an array containing all users excluding managers**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, name, surname, type and email of an user. Manager must not be returned.

```
    [{
        "id":1,
        "name":"John",
        "surname":"Snow",
        "email":"john.snow@supplier.ezwh.com",
        "type":"supplier"
    },{
        "id":2,
        "name":"Michael",
        "surname":"Jordan",
        "email":"michael.jordan@supplier.ezwh.com",
        "type":"supplier"
    },...]
```


- **Permissions allowed**:  Manager
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

### POST

#### **/api/newUser**

- **Creates a new user.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing username, name, surname, password, type. username is the email. Password MUST BE AT LEAST 8 characters.
- **Possible types** : customer, qualityEmployee, clerk, deliveryEmployee, supplier
- **Manager accounts are already created (hard coded) and Administrator is covered by manager**


```
    {
        "username":"user1@ezwh.com",
        "name":"John",
        "surname" : "Smith",
        "password" : "testpassword",
        "type" : "customer"

    }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`409 Conflict` (user with same mail and type already exists), `422 Unprocessable Entity` (validation of request body failed or attempt to create manager or administrator accounts), `503 Service Unavailable` (generic error).

#### **/api/managerSessions**

- **Login of managers**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password. Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: manager info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/customerSessions**

- **Login of customers**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password.  Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: customer info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/supplierSessions**

- **Login of suppliers**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password.  Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: supplier info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/clerkSessions**

- **Login of clerks**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password.  Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: clerk info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/qualityEmployeeSessions**

- **Login of quality employees**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password.  Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: qualityEmployee info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/deliveryEmployeeSessions**

- **Login of delivery employees**
- **Request header** has a line: `Content-Type: application/json`. 
- **Request body**: username and password.  Username must be an email
- **Response**: `200 Ok` (success)  
- **Response body**: delivery employee info (id, username, name).
- **Error responses**: `401 Unauthorized` (wrong username and/or password) or `500 Internal Server Error` (generic error).

#### **/api/logout**
- **Perfoms logout**
- **Request body**: empty.
- **Response**: `200 Ok` (success)  
- **Response body**: empty.
- **Error responses**: `500 Internal Server Error` (generic error).

### PUT

#### **/api/users/:username**

- **Modify rights of a user, given its username. Username is the email of the user.**
- **Request header** has a line: `Content-Type: application/json` and req.params.username to retrieve username (email).
- **Possible types** : customer, qualityEmployee, clerk, deliveryEmployee, supplier
- **Request body**: a JSON object with oldType and newType.
    

```
    {
        "oldType" : "qualityEmployee",
        "newType" : "clerk"
    }
```


- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not found` (wrong username or oldType fields or user doesn't exists), `422 Unprocessable Entity` (validation of request body or of username failed or attempt to modify rights to administrator or manager), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/users/:username/:type**

- **Deletes the user identified by username (email) and type.**
- **Manager/Administrator accounts cannot be deleted.**
- **Request header** : req.params.username to retrieve username. req.params.type to retrieve type.
- **Possible types** : customer, qualityEmployee, clerk, deliveryEmployee, supplier
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of username or of type failed or attempt to delete a manager/administrator), `503 Service Unavailable` (generic error).


## RESTOCK ORDER

**Possible states:** ISSUED, DELIVERY, DELIVERED, TESTED, COMPLETEDRETURN, COMPLETED

### GET

#### **/api/restockOrders**

- **Return an array containing all restock orders**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, issueDate, state, products, supplierId, transportNote (if state != ISSUED) and a list of the RFID, SKUId and ItemId of skuItems (empty if state = ISSUED or DELIVERY) of a restock order.

```
    [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12, "itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20},...],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":12, "itemId":10,"rfid":"12345678901234567890123456789017"},...]
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Clerk, Quality Employee
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/restockOrdersIssued**
Returns an array of all restock orders in state = ISSUED. Example:

- **Return an array containing all restock orders in state = ISSUED**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, issueDate, state, products, supplierId and an empty list of skuItems of a restock order.

```
    [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":12, "itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20},...],
            "supplierId" : 1,
            "skuItems" : []
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Supplier
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/restockOrders/:id**
- **Return a restock order, given its id**.
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the restock order

    
```
        {
            "issueDate":"2021/11/29 09:33",
            "state": "DELIVERED",
            "products": [{"SKUId":12, "itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20},...],
            "supplierId" : 1,
            "transportNote":{"deliveryDate":"2021/12/29"},
            "skuItems" : [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":12, "itemId":10,"rfid":"12345678901234567890123456789017"},...]

        }
```


- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no restock order associated to id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

#### **/api/restockOrders/:id/returnItems**
- **Return sku items to be returned of a restock order, given its id. A sku item need to be returned if it haven't passed at least one quality test**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the restock order's items to be returned

    
```
         [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789016"},
         {"SKUId":12, "itemId":10,"rfid":"12345678901234567890123456789017"},...]

```


- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no restock order associated to id), `422 Unprocessable Entity` (validation of id failed or restock order state != COMPLETEDRETURN), `500 Internal Server Error` (generic error).

### POST

#### **/api/restockOrder**
- **Creates a new restock order in state = ISSUED with an empty list of skuItems.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing issueDate, products and supplierId.
    
```
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"qty":30},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20},...],
            "supplierId" : 1
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Supplier
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of request body failed, supplier doesn't sell a product with a certain itemId or supplier itemId doesn't correspond to SKUId), `503 Service Unavailable` (generic error).


### PUT
#### **/api/restockOrder/:id**
- **Modify the state of a restock order, given its id.**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object with newState.
    
```
        {
            "newState":"DELIVERED"
        }
```


- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Clerk
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no restock order associated to id), `422 Unprocessable Entity` (validation of request body or of id failed), `503 Service Unavailable` (generic error).

#### **/api/restockOrder/:id/skuItems**
- **Add a non empty list of skuItems to a restock order, given its id. If a restock order has already a non empty list of skuItems, merge both arrays**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object with skuItems.
    
```
        {
            "skuItems" : [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789017"},...]
        }
```


- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Clerk
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no restock order associated to id), `422 Unprocessable Entity` (validation of request body or of id failed or order state != DELIVERED), `503 Service Unavailable` (generic error).

#### **/api/restockOrder/:id/transportNote**
- **Add a transport note to a restock order, given its id.**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object with transportNote.
    
```
        {
            "transportNote":{"deliveryDate":"2021/12/29"}
        }
```


- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Supplier
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no restock order associated to id), `422 Unprocessable Entity` (validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/restockOrder/:id**
- **Delete a restock order, given its id.**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).

## RETURN ORDER

### GET

#### **/api/returnOrders**
- **Return an array containing all return orders**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, returnDate, products and restockOrderId of a Return order.

```
    [
        {
            "id":1,
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},...],
            "restockOrderId" : 1
        },
        ...
    ]
```


- **Permissions allowed**:  Manager
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/returnOrders/:id**
- **Return a return order, given its id**.
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the return order

    
```
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},...],
            "restockOrderId" : 1
        }
```


- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no return order associated to id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/returnOrder**
- **Creates a new return order.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing returnDate, products and restockOrderId.
    
```
        {
            "returnDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},...],
            "restockOrderId" : 1
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no restock order associated to restockOrderId), `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).


### PUT

### DELETE

#### **/api/returnOrder/:id**
- **Delete a return order, given its id.**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).


## INTERNAL ORDER

**Possible states:** ISSUED, ACCEPTED, REFUSED, CANCELED, COMPLETED

### GET

#### **/api/internalOrders**

- **Return an array containing all internal orders**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, issueDate, state, products and customerId of an Internal order. Products contains SKUId, description, price and qty if state !=COMPLETED, otherwise it contains SKUId, description, price, RFID.

```
    [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        },
        {
            "id":2,
            "issueDate":"2021/11/30 19:33",
            "state": "COMPLETED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                        {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"},...],
            "customerId" : 1
        },
        ...
    ]
```


- **Permissions allowed**:  Manager
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/internalOrdersIssued**

- **Return an array containing all internal orders in state = ISSUED**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, issueDate, state, products and customerId of an Internal order. Products contains SKUId, description, price and qty

```
    [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":2},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Customer
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/internalOrdersAccepted**
- **Return an array containing all internal orders in state = ACCEPTED**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, issueDate, state, products and customerId of an Internal order. Products contains SKUId, description, price and qty.

```
    [
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        },
        ...
    ]
```


- **Permissions allowed**:  Manager, Delivery Employee
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/internalOrders/:id**

- **Return an internal order, given its id**.
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the internal order. Products contains SKUId, description, price and qty if state !=COMPLETED, otherwise it contains SKUId, description, price, RFID.
    
```
        {
            "id":1,
            "issueDate":"2021/11/29 09:33",
            "state": "ACCEPTED",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        }
```


- **Permissions allowed**:  Manager, Delivery Employee
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no internal order associated to id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/internalOrders**

- **Creates a new internal order in state = ISSUED.**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing issueDate, products and customerId.
    
    
```
        {
            "issueDate":"2021/11/29 09:33",
            "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                        {"SKUId":180,"description":"another product","price":11.99,"qty":3},...],
            "customerId" : 1
        }
```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Customer
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).

### PUT
#### **/api/internalOrders/:id**

- **Modify the state of an internal order, given its id. If newState is = COMPLETED an array of RFIDs is sent**
- **Request header** has a line: `Content-Type: application/json` and req.params.id to retrieve id.
- **Request body**: a JSON object with newState and if newState= COMPLETED also a products array containing SKuID and RFID. If state is not COMPLETED and a products array is sent, it is ignored.
    
```
        {
            "newState":"ACCEPTED"
        }

        OR

        {
            "newState":"COMPLETED",
            "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"},...]
        }
```


- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**:  Manager, Delivery Employee, Internal Customer
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (no internal order associated to id), `422 Unprocessable Entity` (validation of request body or of id failed), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/internalOrders/:id**
- **Delete an internal order, given its id.**
- **Request header** : req.params.id to retrieve id
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).

## ITEM

### GET

#### **/api/items**

- **Return an array containing all Items**.
- **Request body**: empty.
- **Response**: `200 OK` (success); body: An array of objects, each describing id, description, price, SKUId and supplierId

    ```
    [
        {
            "id":1,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 2
        },
        {
            "id":2,
            "description" : "another item",
            "price" : 12.99,
            "SKUId" : 2,
            "supplierId" : 1
        },
        ....
    ]

    ```


- **Permissions allowed**:  Manager, Supplier
- **Error responses**:  `401 Unauthorized` (not logged in or wrong permissions), `500 Internal Server Error` (generic error).

#### **/api/items/:id/:supplierId**

- **Return an item, given its id and supplierId**.
- **Request header** : req.params.id to retrieve id, req.params.supplierId to retrieve supplierId
- **Request body**: none
- **Response**: `200 OK` (success); body: An object describing the Item

    
        {
            "id":1,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 2
        }

- **Permissions allowed**:  Manager
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `404 Not Found` (no item associated to id), `422 Unprocessable Entity` (validation of id failed), `500 Internal Server Error` (generic error).

### POST

#### **/api/item**

- **Creates a new Item**
- **Request header** has a line: `Content-Type: application/json`.
- **Request body**: a JSON object containing id, description, price, SKUId, supplierId.
 Example of Request body

    ```
        {
            "id" : 12,
            "description" : "a new item",
            "price" : 10.99,
            "SKUId" : 1,
            "supplierId" : 2
        }
    ```


- **Response header**:  `201 Created` (success). 
- **Response body**: none.
- **Permissions allowed**: Supplier
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not Found` (Sku not found), `422 Unprocessable Entity` (validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID), `503 Service Unavailable` (generic error).


### PUT

#### **/api/item/:id/:supplierId**

- **Modify an existing item.**
- **Request header** has a line: `Content-Type: application/json`, req.params.id to retrieve id and req.params.supplierId to retrieve supplierId.
- **Request body**: a JSON object containing id and new description and new Price.
If some fields doesn't change, send the old value.

Example of Request body

    {
        "newDescription" : "a new sku",
        "newPrice" : 10.99
    }

- **Response header**:  `200 OK` (success). 
- **Response body**: none.
- **Permissions allowed**: Supplier
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions),`404 Not found` (Item not existing), `422 Unprocessable Entity` (validation of request body failed), `503 Service Unavailable` (generic error).

### DELETE

#### **/api/items/:id/:supplierId**

- **Delete an item receiving its id and supplierId.**
- **Request header** : req.params.id to retrieve id and req.params.supplierId to retrieve supplierId
- **Request body**: none
- **Response header**:  `204 No Content` (success).
- **Response body**: none.
- **Permissions allowed**: Supplier
- **Error responses**: `401 Unauthorized` (not logged in or wrong permissions), `422 Unprocessable Entity` (validation of id failed), `503 Service Unavailable` (generic error).
