# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
![](assets/test/dependencygraph.png) 
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>
    
    We do the integration test in a bottom-up way.
    Firstly, we did the dao test for each class.
    Secondly we do real db test for controllers base on dao(e.g. add some necessory data before each test case).
    Finally, we finished api test for each possible request and check the response.

    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes |Jest test cases |
|--|--|
| internalorder   | internalorder.test.js   |
| item            | item.test.js            |
| position        | position.test.js        |
| restockorder    | restockorder.test.js    |
| returnorder     | returnorder.test.js     |
| sku             | sku.test.js             |
| skuitem         | skuitem.test.js         |
| testdescriptor  | testdescriptor.test.js  |
| testresult      | testresult.test.js      |
| user            | user.test.js            |


## Step 2
| Classes  | Jest test cases |
|--|--|
| internalorder    | internalordercontroller.dbreall.test.js   |
| item             | item.dbreal.test.js            |
| position         | position.dbreal.test.js        |
| restockorder     | restockorder.dbreal.test.js    |
| returnorder      | returnorder.dbreal.test.js     |
| sku              | sku.dbreal.test.js             |
| skuitem          | skuitem.dbreal.test.js         |
| testdescriptor   | testdescriptor.dbreal.test.js  |
| testresult       | testresult.dbreal.test.js      |
| user             | user.dbreal.test.js            |


## Step 3 

   
| Classes  | mocha test |
|--|--|
| internalorder   | internalorderapitest.js   |
| item            | itemapitest.js            |
| position        | positionapitest.js        |
| restockorder    | restockorderapitest.js    |
| returnorder     | returnorderapitest.js     |
| sku             | skuapitest.js             |
| skuitem         | skuitemapitest.js         |
| testdescriptor  | testdescriptorapitest.js  |
| testresult      | testresultapitest.js      |
| user            | userapitest.js            |




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario 1-4

| Scenario |  List SKUs |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  Post condition   | Showing all SKUs  |
| Step#  | Description               |
|  1     | M goes to SKU page        |
|  2     | System provide exist SKUs |

## Scenario 1-5

| Scenario |  Search specific SKU |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  Post condition   | Showing SKU info |
| Step#  | Description |
|  1     | M check all SKUs        |
|  2     | M select one SKU        |
|  3     | System provide SKU info |

## Scenario 1-6

| Scenario |  Delete SKU |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|                   | SKU s exists      |
|  Post condition   | SKU s is deleted |
| Step#  | Description |
|  1     | M check all SKUs        |
|  2     | M select one SKU        |
|  3     | M delete s              |
|  4     | System delete s in DB   |

## Scenario 2-6

| Scenario |  List positions |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  Post condition   | Showing all positions |
| Step#  | Description |
|  1     | M goes to position page        |
|  2     | System provide exist positions |

## Scenario 11-3

| Scenario |  Delete SKU item |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|                   | SKU item exists     |
|  Post condition   | SKU item is deleted    |
| Step#  | Description |
|  1     | M check all SKU items          |
|  2     | M select one SKU item          |
|  3     | M delete SKU item              |
|  4     | System delete SKU item in DB   |

# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| S1-1   | FR2 | add one sku,try to add invalid sku    |
| S1-2   | FR2 | update sku position |
| S1-2   | FR2 | update sku position with invalid ID |
| S1-2   | FR2 | update sku position with not exists sku ID,invalid position,position not available    |
| S1-2   | FR2 | update sku position with invalid position  |
| S1-3   | FR2 | update sku  |
| S1-3   | FR2 | update not exists sku   |
| S1-3   | FR2 | update sku with invalid ID    |
| S1-4   | FR2 | get skus    |
| S1-5   | FR2 | get existing sku by id    |
| S1-5   | FR2 | get sku not found    |
| S1-5   | FR2 | get sku invalid id    |
| S1-6   | FR2 | delete sku    |
| S1-6   | FR2 | delete sku with invalid ID    |
| S2-1   | FR3 | add one position,add invalid sku    |
| S2-2   | FR3 | update positionID   |
| S2-2   | FR3 | update positionID but positionID not found   |
| S2-2   | FR3 | update positionID with invalid body  |
| S2-2   | FR3 | update positionID with invalid positionID   |
| S2-3   | FR3 | update position  |
| S2-3   | FR3 | update position but positionID not found  |
| S2-4   | FR3 | update position  |
| S2-4   | FR3 | update position but positionID not found  |
| S2-5   | FR3 | delete position  |
| S2-5   | FR3 | delete validation failed    |
| S2-6   | FR3 | get positions    |
| S3-2   | FR5 | add one restock order    |
| S3-2   | FR5 | add one invalid restock order    |
| S4-1   | FR1 | Create user 1,2,3,4   |
| S4-3   | FR1 | delete user 1,2,3   |
| S5-1-1 | FR5 | updateRestockOrder    |
| S5-2-1 | FR5 | updateRestockOrder    |
| S6-1   | FR5 | add return order |
| S6-1   | FR5 | add invalid return order    |
| S6-1   | FR5 | add return order but restock order not found    |
| S6-2   | FR5 | add return order    |
| S6-2   | FR5 | add invalid return order    |
| S6-2   | FR5 | add return order but restock order not found    |
| S9-1   | FR6 | updateInternalOrder    |
| S9-2   | FR6 | updateInternalOrder    |
| S9-3   | FR6 | updateInternalOrder    |
| S10-1  | FR5.12 | updateInternalOrder    |
| S11-1  | FR7 | add one skuitem    |
| S11-1  | FR7 | add one skuitem with invalid parameters  |
| S11-1  | FR7 | add one skuitem but SKUId not found    |
| S11-2  | FR7 | update one skuitem   |
| S11-2  | FR7 | update one skuitem with invalid parameters    |
| S11-2  | FR7 | update one skuitem but SKU item not found    |
| S11-3  | FR7 | delete sku item    |
| S11-3  | FR7 | delete sku item with invalid rfid    |
| S12-1  | FR3 | add a td   |
| S12-1  | FR3 | add td with invalid idSKU   |
| S12-2  | FR3 | update td    |
| S12-2  | FR3 | update not exists td    |
| S12-2  | FR3 | update with invalid parameters    |
| 12-3   | FR3 | delete Test Descriptor |



# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
| NFR1 | All                    |
| NFR2 | All                    |
| NFR4 | Add a position         |
| NFR6 | Add a sku item         | 
| NFR7 | Update position Volume | 
| NFR8 | Update position weight | 
| NFR9 | All                    | 

