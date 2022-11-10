# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

### **Class *internal order* - method *newProducts***

**Criteria for method *new(internalOrder)*:**
 - C1:value of internalOrder.issueDate
 - C2:number of field in products
 - C3:value of products.SKUId
 - C4:value of customerId

**Predicates for method *new(internalOrder)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  not null    |
|          |  null |
|    C2    |  equal to 4  |
|          |  not equal        |
|    C3    |  has corresponding sku  |
|          |  doesn't have  |
|    C4    |  has corresponding user    |
|          |  doesn't have |


**Boundaries**:


**Combination of predicates**:

| C1 | C2 | C3 | C4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| not null           | equal     | has     		| has          |V|...|Add a new internal order successfully|
| not null           | equal     | has     		| doesn't have |I|...|...|
| not null           | equal     | doesn't have | has          |I|...|new internal order not success,SKU doesn't exist|
| not null           | equal     | doesn't have | doesn't have |I|...|...|
| not null           | not equal | has     		| has          |I|...|...|
| not null           | not equal | has     		| doesn't have |I|...|...|
| not null           | not equal | doesn't have | has          |I|...|...|
| not null           | not equal | doesn't have | doesn't have |I|...|...|
| null 				 | equal     | has     		| has          |I|...|...|
| null 				 | equal     | has     		| doesn't have |I|...|...|
| null 				 | equal     | doesn't have | has          |I|...|...|
| null 				 | equal     | doesn't have | doesn't have |I|...|...|
| null 				 | not equal | has     		| has          |I|...|...|
| null 				 | not equal | has     		| doesn't have |I|...|...|
| null 				 | not equal | doesn't have | has          |I|...|...|
| null 				 | not equal | doesn't have | doesn't have |I|...|...|

### **Class *item* - method *update***

**Criteria for method *update(id, supplierId, newItem)*:**

 - C1:value of Id
 - C2:value of supplierId
 - C3:number of field in newItem
 - C4:value of keys of newtd

**Predicates for method *update(id, supplierId, newItem)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding test item    |
|          |  doesn't have|
|    C2    |  has corresponding test supplier    |
|          |  doesn't have|
|    C3    |  equal to the number of columns -1(except id)  |
|          |  not equal        |
|    C4    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |

**Boundaries**:


**Combination of predicates**:

| C1 | C2 | C3 | C4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| has          | has          | equal     | same     |V|...|update item success|
| has          | has          | equal     | not same |I|...|...|
| has          | has          | not equal | same     |I|...|...|
| has          | has          | not equal | not same |I|...|...|
| has          | doesn't have | equal     | same     |I|...|...|
| has          | doesn't have | equal     | not same |I|...|...|
| has          | doesn't have | not equal | same     |I|...|...|
| has          | doesn't have | not equal | not same |I|...|...|
| doesn't have | has          | equal     | same     |I|ItemId not present in db|update item not success, value of id wrong|
| doesn't have | has          | equal     | not same |I|...|...|
| doesn't have | has          | not equal | same     |I|...|...|
| doesn't have | has          | not equal | not same |I|...|...|
| doesn't have | doesn't have | equal     | same     |I|...|...|
| doesn't have | doesn't have | equal     | not same |I|...|...|
| doesn't have | doesn't have | not equal | same     |I|...|...|
| doesn't have | doesn't have | not equal | not same |I|...|...|

### **Class *item* - method *delete(id, supplierId)***

**Criteria for method *delete(id, supplierId)*:**
 - C1:value of id
 - C2:value of supplierId

**Predicates for method *delete(id, supplierId)*:**
| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding item    |
|          |  doesn't have |
|    C2    |  has corresponding supplierId  |
|          |  doesn't have |

**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| has           | has             |V|...|delete item success|
| has           | doesn't have    |I|supplierId not present in db|delete item not success, supplierId wrong|
| doesn't have  | has             |I|id not present in db|delete item not success, id wrong|
| doesn't have  | doesn't have    |I|...|...|

### **Class *position* - method *updatePositionSpace(positionID, occupiedWeight, occupiedVolume)***


**Criteria for method *updatePositionSpace(positionID, occupiedWeight, occupiedVolume)*:**
 - C1:value of positionID
 - C2:value of occupiedWeight
 - C3:value of occupiedVolume

**Predicates for method *updatePositionSpace(positionID, occupiedWeight, occupiedVolume)*:**
| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding position    |
|          |  doesn't have |
|    C2    |  occupiedWeight >= 0  |
|          |  <0 |
|    C3    |  occupiedVolume >= 0  |
|          |  <0 |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|     C2     |       C2==0         |
|     C3     |       C3==0         |

**Combination of predicates**:

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| has                   | C2 >= 0 | C3 >= 0 |V|...|Add a new position successfully|
| has                   | C2 >= 0 | C3 < 0  |I|Volume not positive|update position space failed occupied Volume not positive|
| has                   | C2 < 0  | C3 >= 0 |I|...|...|
| has                   | C2 < 0  | C3 < 0  |I|Weight not positive|update position space failed occupied Weight not positive|
| doesn't have          | C2 >= 0 | C3 >= 0 |I|...|...|
| doesn't have          | C2 >= 0 | C3 < 0  |I|...|...|
| doesn't have          | C2 < 0  | C3 >= 0 |I|...|...|
| doesn't have          | C2 < 0  | C3 < 0  |I|...|...|


### **Class *position* - method *updatePositionID(positionID, newPosition)***


**Criteria for method *updatePositionID(positionID, newPosition)*:**
- C1:value of positionID
- C2:value of newPosition

**Predicates for method *updatePositionID(positionID, newPosition)*:**
| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding position    |
|          |  doesn't have |
|    C2    |  It is a 12 digits string  |
|          |  It is not |

**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| has           | 12 digits string  |V|...|update positionID success|
| has           | It is not         |I|newPositionID wrong|update position space failed newPositionID not good|
| doesn't have  | 12 digits string  |I|PositionId not found in db|update positionID failed position not found|
| doesn't have  | It is not         |I|...|...|


### **Class *restockorder* - method *new***


**Criteria for method *newRestockOrder(restockOrder)*:**

 - C1:number of field in restockOrder
 - C2:value of keys of restockOrder
 - C3:value of restockOrder.supplierId

**Predicates for method *newRestockOrder(restockOrder)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  equal to the number of columns -2(except id and state)      |
|          |  not equal        |
|    C2    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |
|    C3    |  has corresponding supplier    |
|          |  doesn't have |

**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| equal     | same     | has          |V|Success|add Restock Order success|
| equal     | same     | doesn't have |I|...|...|
| equal     | not same | has          |I|...|...|
| equal     | not same | doesn't have |I|...|...|
| not equal | same     | has          |I|...|...|
| not equal | same     | doesn't have |I|...|...|
| not equal | not same | has          |I|...|...|
| not equal | not same | doesn't have |I|...|...|



### **Class *restockorder* - method *updateState***


**Criteria for method *updateState(id, body)*:**

 - C1:number of field in body
 - C2:value of key of body
 - C3:value of id

**Predicates for method *updateState(id, body)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  number == 1        |
|          |  number != 1        |
|    C2    |  value of the key==newState  |
|          |  key != newState  |
|    C3    |  has corresponding restockOrder    |
|          |  doesn't have |

**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| equal     | same     | has          |V|Success|update Restock Order SkuItems success|
| equal     | same     | doesn't have |I|...|...|
| equal     | not same | has          |I|...|...|
| equal     | not same | doesn't have |I|...|...|
| not equal | same     | has          |I|...|...|
| not equal | same     | doesn't have |I|...|...|
| not equal | not same | has          |I|...|...|
| not equal | not same | doesn't have |I|...|...|



### **Class *sku* - method *updatePosition***

**Criteria for method *updatePosition(id, position)*:**

 - C1:value of Id
 - C2:number of field in position

**Predicates for method *updatePosition(id, position)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding sku    |
|          |  doesn't have|
|    C2    |  number == 1      |
|          |  number != 1      |


**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|
| has           | number == 1  |V|Success|update sku position|
| has           | number != 1  |I|...|...|
| doesn't have  | number == 1  |I|...|...|
| doesn't have  | number != 1  |I|...|...|



### **Class *sku* - method *update***


**Criteria for method *update(id, newSku)*:**

 - C1:value of Id
 - C2:number of field in newSku
 - C3:value of keys of newSku

**Predicates for method *update(id, newSku)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding sku    |
|          |  doesn't have |
|    C2    |  equal to the number of columns -1(except id)      |
|          |  not equal        |
|    C3    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |

**Boundaries**:


**Combination of predicates**:

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| has          | equal     | same     |V|Success|update sku|
| has          | equal     | not same |I|...|...|
| has          | not equal | same     |I|...|...|
| has          | not equal | not same |I|...|...|
| doesn't have | equal     | same     |I|...|Update sku 1st error|
| doesn't have | equal     | not same |I|...|...|
| doesn't have | not equal | same     |I|...|...|
| doesn't have | not equal | not same |I|...|Update sku 2nd error|


### **Class *test descriptor* - method *update***


**Criteria for method *update(id, newtd)*:**

 - C1:value of Id
 - C2:number of field in newtd
 - C3:value of keys of newtd
 - C4:value of newtd.idSKU

**Predicates for method *update(id, newtd)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding test descriptor    |
|          |  doesn't have|
|    C2    |  equal to the number of columns -1(except id)      |
|          |  not equal        |
|    C3    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |
|    C4    |  has corresponding SKU    |
|          |  doesn't have|

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |

**Combination of predicates**:

| C1 | C2 | C3 | C4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| has          | equal     | same     | has          |V|Success|update success|
| has          | equal     | same     | doesn't have |I|idSKU not found in db|update test descriptor not success, idSKU wrong|
| has          | equal     | not same | has          |I|...|...|
| has          | equal     | not same | doesn't have |I|...|...|
| has          | not euqal | same     | has          |I|...|...|
| has          | not euqal | same     | doesn't have |I|...|...|
| has          | not euqal | not same | has          |I|...|...|
| has          | not euqal | not same | doesn't have |I|...|...|
| doesn't have | equal     | same     | has          |I|id not found in db|update test descriptor not success, update fail|
| doesn't have | equal     | same     | doesn't have |I|...|...|
| doesn't have | equal     | not same | has          |I|...|...|
| doesn't have | equal     | not same | doesn't have |I|...|...|
| doesn't have | not euqal | same     | has          |I|...|...|
| doesn't have | not euqal | same     | doesn't have |I|...|...|
| doesn't have | not euqal | not same | has          |I|...|...|
| doesn't have | not euqal | not same | doesn't have |I|...|...|



### **Class *test descriptor* - method *new***


**Criteria for method *new(tr)*:**

 - C1:number of field in tr
 - C2:value of keys of tr
 - C3:value of tr.idSKU

**Predicates for method *new(tr)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  equal to the number of columns -1(except id)      |
|          |  not equal        |
|    C2    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |
|    C3    |  has corresponding sku    |
|          |  doesn't have |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |

**Combination of predicates**:

| Criteria 1 | Criteria 2 | Criteria 3 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|
| has          | equal     | same     |V|Success|add success|
| has          | equal     | not same |I|id of sku not found in db|create new test descriptor not success, idSKU wrong|
| has          | not equal | same     |I|...|...|
| has          | not equal | not same |I|...|...|
| doesn't have | equal     | same     |I|...|...|
| doesn't have | equal     | not same |I|...|...|
| doesn't have | not equal | same     |I|...|...|
| doesn't have | not equal | not same |I|...|...|




### **Class *test result* - method *update***


**Criteria for method *update(rfid,id,newTR)*:**

 - C1:value of RFID
 - C2:value of Id
 - C3:number of field in newTR
 - C4:value of keys of newTR

**Predicates for method *update(rfid,id,newTR)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  has corresponding sku item    |
|          |  doesn't have |
|    C2    |  has corresponding test result    |
|          |  doesn't have|
|    C3    |  equal to the number of columns -1(except id)      |
|          |  not equal        |
|    C4    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |

**Combination of predicates**:

| C1 | C2 | C3 | C4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| has          | has          | equal     | same     |V|Success|update test result success|
| has          | has          | equal     | not same |I|idTestDescriptor not found in db|update test result not success, wrong tdId|
| has          | has          | not equal | same     |I|...|...|
| has          | has          | not equal | not same |I|...|...|
| has          | doesn't have | equal     | same     |I|...|...|
| has          | doesn't have | equal     | not same |I|...|...|
| has          | doesn't have | not equal | same     |I|...|...|
| has          | doesn't have | not equal | not same |I|...|...|
| doesn't have | has          | equal     | same     |I|...|...|
| doesn't have | has          | equal     | not same |I|...|...|
| doesn't have | has          | not equal | same     |I|...|...|
| doesn't have | has          | not equal | not same |I|...|...|
| doesn't have | doesn't have | equal     | same     |I|...|...|
| doesn't have | doesn't have | equal     | not same |I|...|...|
| doesn't have | doesn't have | not equal | same     |I|...|...|
| doesn't have | doesn't have | not equal | not same |I|...|...|

### **Class *test result* - method *new(tr)***


**Criteria for method *new(tr)*:**

 - C1:number of field in tr
 - C2:value of keys of tr
 - C3:value of tr.rfid
 - C4:value of tr.idTestDescriptor

**Predicates for method *new(tr)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  equal to the number of columns -1(except id)      |
|          |  not equal        |
|    C2    |  same as the API requirement  |
|          |  at least one value is different from the requirement  |
|    C3    |  has corresponding sku item    |
|          |  doesn't have |
|    C4    |  has corresponding test descriptor    |
|          |  doesn't have |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |

**Combination of predicates**:

| C1 | C2 | C3 | C4 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|-------|-------|-------|
| equal     | same     | has          | has          |V|Success|add success|
| equal     | same     | has          | doesn't have |I|Test descriptor not found in db|create new test result not success, add fail|
| equal     | same     | doesn't have | has          |I|...|...|
| equal     | same     | doesn't have | doesn't have |I|...|...|
| equal     | not same | has          | has          |I|...|...|
| equal     | not same | has          | doesn't have |I|...|...|
| equal     | not same | doesn't have | has          |I|...|...|
| equal     | not same | doesn't have | doesn't have |I|...|...|
| not equal | same     | has          | has          |I|...|...|
| not equal | same     | has          | doesn't have |I|...|...|
| not equal | same     | doesn't have | has          |I|...|...|
| not equal | same     | doesn't have | doesn't have |I|...|...|
| not equal | not same | has          | has          |I|...|...|
| not equal | not same | has          | doesn't have |I|...|...|
| not equal | not same | doesn't have | has          |I|...|...|
| not equal | not same | doesn't have | doesn't have |I|...|...|






### **Class *user* - method *new***


**Criteria for method *new(user)*:**

- C1: number of field in user

**Predicates for method *new(user)*:**

| Criteria | Predicate |
| -------- | --------- |
|    C1    |  equal to the number of columns -1(except id)      |
|          |  not equal        |

**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |

**Combination of predicates**:

| Criteria 1 | Valid / Invalid | Description of the test case | Jest test case |
|-------|-------|-------|-------|
| equal    |V| Success | create new user |
| not equal|I| ... | ... |









# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
| testItemDao | new internal order success |
|   | new internal order not success, wrong customerId |
|   | new internal order not success, wrong skuId |
|   | new internal order not success, null issueDate |
|   | new internal order success |
|   | new internal order success |
| testItemDao | update item success |
|   | update item not success, value of supplierID |
|   | update item not success, value of id wrong |
|   | delete item not success, id wrong |
|   | delete item not success, supplierId wrong |
|   | delete item success |
| testPositionDao  | create new position |
|   | update position space |
|   | update position space failed position not found |
|   | update position space failed occupied Weight not positive |
|   | update position space failed occupied Volume not positive |
|   | update positionID success |
|   | update positionID failed position not found |
|   | update position space failed newPositionID not good |
| testRestockOrderDAO  | delete db |
|   | create new restock order |
|   | update restock order state |
| testSkuDao  | update sku |
|   | update sku position |
| testSkuItemDao  | update skuitem |
|   | set sku available |
| testTestDescriptorDao  | create new test descriptor |
|   | create new test descriptor not success, idSKU wrong |
|   | update test descriptor |
|   | update test descriptor not success, idSKU wrong |
|   | update test descriptor not success, id not found |
| testTestResultDao  | create new test result |
|   | create new test descriptor not success, test descriptor wrong |
|   | update test result success |
|   | update test result not success, new idTestDescriptor wrong |
| testUserDao  | delete db |
|   | create new user |

### Code coverage report

![](assets/test/coverage.png) 





