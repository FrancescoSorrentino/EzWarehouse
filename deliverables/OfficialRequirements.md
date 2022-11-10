# Requirements Document - EZ WH

Authors: Rocco Iamello, Maurizio Morisio 

Date: 14 April  2022

Version: 1.0

 
| Version number | Change |
| ----------------- |:-----------|
|0.6 | Update NFR, UC12,  removed customer account creation, update glossary|
|0.5 | canceled customer |
|0.3     | Add UC11 in [Use cases](#use-cases) <br> Update [Use case diagram](#use-case-diagram) |
|0.2.2|[Scenario 2.6](#scenario-2-6) enriched of Sku S and name of test descriptor|
|0.2.1| Field available for sku item in [Glossary](#glossary)|
|0.2|Add link restock order - sku item and update states of Restock Order in [Glossary](#glossary)<br> Split UC5 in UC5.1, UC5.2, UC 5.3 in [Use cases](#use-cases) <br> Update [Use case diagram](#use-case-diagram)|
|0.1.7|Add name in test descriptor in [Glossary](#glossary)|
|0.1.6|Low Level FR removed (FR 2.5-2.9,3.1.4-3.1.6)<br> Update [System design](#system-design) with EZWHServer<br>Add customer in [Glossary](#glossary)|
|0.1.5 | [Functional Requirements](#functional-requirements) <br> [Non functional requirements](#non-functional-requirements) added <br> Access right added |
|0.1.4| [Use cases](#use-cases) added <br> [Scenarios](#use-cases) added <br> [Use case diagram](#use-case-diagram) added <br>  [Glossary](#glossary) in plantuml format |
|0.1.3|[Use cases](#use-cases) sketch added <br> [Abstract](#abstract) updated<br>Update [Glossary](#glossary), added occupation fields for position|
|0.1.2|[Stakeholders](#stakeholders) added <br> [Context Diagram and interfaces](#context-diagram-and-interfaces) added <br>[System design](#system-design) added <br> [Deployment diagram](#deployment-diagram) added|
|0.1.1| [Glossary](#glossary) added <br>Order is now restock order<br> Restock order and Internal order have a state<br>Added description of return, in particular if after return qty is under threshold, issue a new order|
|||


# Contents

- [Abstract](#abstract)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
	+ [Context Diagram](#context-diagram)
	+ [Interfaces](#interfaces) 
	
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
	+ [Functional Requirements](#functional-requirements)
	+ [Non functional requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
	+ [Use case diagram](#use-case-diagram)
	+ [Use cases](#use-cases)
    	+ [Relevant scenarios](#use-cases)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)


# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory.

EZWH is a software application to:
- manage suppliers and restock orders;
- manage the reception of ordered items;
- manage internal orders and deliveries.

A warehouse stores physical items, in a dedicated space (could be several hundred square meters of surface, on 10-15 meters height). Each item is described by an SKU (Stock Keeping Unit). An SKU corresponds to a product descriptor in UML patterns seen at lesson, and has a unique ID. The ID is specific to the company that manages the warehouse.  The item (we will call it SKUitem in the following) is an instance described by an SKU, and is identified by a unique ID, written inside an RFID label physically attached to the SKUitem. This assures that each item can be traced throughout its lifecycle in the warehouse, and later.

The physical space of the warehouse is organized in aisles. An aisle has a unique ID, and corresponds to a parallelepiped structure (usally made of a metallic frame). The aisle is further organised in rows and columns. A position (identified by aisle, row, column) corresponds to a smaller parallelepiped. A position will store a number of SKUitems of one SKU only.  The dimension of the parallelepiped depends on the size of SKUitems that will be stored in it. Clearly there is a limit to the number of SKUitems that can be stored in a position, depending on the volume of the SKUitem and of the position. Further, there is a also constraint coming from the weight of SKUitems, and the weight that the metallic structure can support.

The basic information to be managed by an application to support a WH is the association SKUitem - position, answering to the question, where is an SKUitem?  
The two operations related to this are store an SKUitem in a position, collect an SKUitem from a position. 
A prerequisite to this is to decide where an SKU will be stored, so allocating one (or more than one) positions to an SKU.

Besides, there is a wider flow to be considered. SKUitems come from external suppliers, and are requested by internal customers. Internal customers are roles within the company who need one or more SKUitems (ex internal customer could be the factory that assembles SKU items to produce a certain product). The application supports this flow with restock orders and internal orders.

A manager (or a similar role inside the company, ex purchase office) places a restock order to a supplier, ordering a certain number of SKUitems. The supplier will send them, the warehouse will receive the parcel (ex with a truck, after days or weeks). At reception a clerk has to check that the items received correspond to a restock order, and if yes accepts them. This check is done using the transport note. A transport note is a document issued by the supplier, that describes what is shipped in a parcel, mentioning the restock order number. If the check is ok the items are received, and each of them is tagged with an RFID. 

A certain SKU can be provided by many suppliers. For doing a restock order the manager has to select one supplier (this selection is not supported by the application but is a decision taken by the manager). However, a certain SKU has, in general, a different ID for each supplier. So the correspondence between the internal ID of an SKU, and the ID for each supplier must be managed. In fact the restock order must mention the id of the SKU as given by the supplier. 

Items are not immediately stored in the WH after they are received. Beforehand they must undergo a quality check. A quality employee performs one or more quality tests, on some or all of the SKUitems received with a restock order. The list of tests to be executed on an SKU has to be defined upfront, and similarly for the acceptance policy (which tests must or should be passed). SKUitems that do not pass one or more tests are returned to the supplier, defining  a return order to the supplier. SKU items that pass the tests are stored in the WH.

An item is collected by the WH after an internal order is received. An internal order (similarly to a restock order) refers to one or more items belonging to one or more SKUs. The internal order refers to SKUs, using SKUs ids. A clerk receives the internal order, and collects the requested items. Items should be collected FIFO, to avoid that some items 'age' more than others. After physical collection of the items the application records they are not anymore in the Wh and releases the place they were occupying. 




# Stakeholders

| Stakeholder name  | Description | 
| ----------------- |:-----------|
| Clerk | Handles restock order reception, stock and pickup tested items in warehouse |
| Delivery employee | Handles deliveries of internal orders |
| Quality Check Employee | Performs tests of received items, decides which to stock and which to return|
| Manager | Monitors warehouse, issue restock orders, manage suppliers, issue return orders  |
| Internal customer  | Issues internal orders to the warehouse |
| Administrator | Installs the application, mantains it, defines users, assign privileges |
| Supplier | Receives restock orders, provides items |

# Context Diagram and interfaces

## Context Diagram

```plantuml
top to bottom direction
actor Administrator as a
actor Clerk as ck
actor QualityCheckEmployee as qce
actor DeliveryEmployee as de
actor Manager as mngr
actor Supplier as sp
actor InternalCustomer as c
actor Employee as e

(EZWH) -- sp
a -up-|> mngr
mngr --> (EZWH)
c -up-|> e
ck -up-|> e
de -up-|> e
qce -up-|> e
e --> (EZWH)

```

## Interfaces

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------|:-----|
| Clerk | GUI | Screen keyboard mouse on PC|
| Delivery employee | GUI | Screen keyboard mouse on PC|
| Quality Check Employee | GUI | Screen keyboard mouse on PC|
| Manager | GUI | Screen keyboard mouse on PC|
| Administrator | GUI | Screen keyboard mouse on PC  |
| Internal Customer | GUI | Screen keyboard mouse on PC  |
| Supplier | GUI | Screen keyboard mouse on PC |




# Functional and non functional requirements

## Functional Requirements


| ID        | Description  |
| ------------- |:-------------| 
|  FR1     |  Manage users and rights (users are Administrator, Manager, Clerk, Delivery Employee, Quality Check Employee, Internal customers) |
| FR1.1    | Define a new user, or modify an existing user |
| FR1.2     | Delete a user |
| FR1.3     |    List all users   |
| FR1.4    |    Search a user   |
| FR1.5  |  Manage rights. Authorize access to functions to specific actors according to access rights|
| FR2   | Manage SKU |
| FR2.1    | Define a new SKU, or modify an existing SKU|
| FR2.2     | Delete a SKU |
| FR2.3     | List all SKUs |
| FR2.4   | Search a SKU (by ID, by description) |
| FR3 | Manage Warehouse |
| FR3.1 | Manage positions |
| FR3.1.1 | Define a new position, or modify an existing position|
| FR3.1.2 | Delete a position |
| FR3.1.3 | List all positions |
| FR3.1.4 | Modify attributes of a position |
| FR3.2 | Manage quality tests |
| FR3.2.1 | Add a quality test |
| FR3.2.2 | Modify a quality test |
| FR3.2.3 | Delete a quality test |
| FR 4 | Manage internal customers |
| FR4.1 | Register or modify a customer |
| FR4.2 | Delete a customer  |
| FR4.3 | Search a customer  |
| FR4.4 | List  all customers  |
| FR5 | Manage a restock order |
| FR5.1 | Start a restock order  |
| FR5.2 | Add a SKU to a restock order  |
| FR5.3 | Define quantity of SKU to be ordered  |
| FR5.4 | Delete a SKU from a restock order  |
| FR5.5 | Select a Supplier for the restock order  |
| FR5.6 | Issue  a restock order  |
| FR5.7 | Change state of a restock order |
| FR5.8 | Manage reception of a restock order |
| FR5.8.1 | Create and tag a SKU item with an RFID|  
| FR5.8.2 | Store result of a quality test on a SKU Item |
| FR5.8.3 | Store a SKU Item |
| FR5.9 | Start  a return order |
| FR5.10 | Return a SKU item listed in a restock order |
| FR5.11 | Commit a return order  |
| FR5.12 | Change state of a return order |
| FR6 | Manage internal orders|
| FR6.1 | Start an internal order  |
| FR6.2 | Add a SKU to an internal order  |
| FR6.3 | Define quantity of SKU to be ordered  |
| FR6.4 | Delete a SKU from an internal order  |
| FR6.5 | Issue an internal order  |
| FR6.6 | Accept, reject or cancel an internal order|
| FR6.7 | Change state of an internal order |
| FR6.8 | Manage delivery of an internal order |
| FR6.9 | Select SKU Item with a FIFO criterion |
| FR6.10 | Remove SKU Item from warehouse |
| FR7 | Manage Items |


### Access right, actor vs function

| Function | Administrator | Manager | Clerk | Delivery Employee | Quality Check Employee | Internal Customer | Supplier|
| -------- | ----- | ------------ | ------- | ----- | ------------ | ------- | ------- |
| FR1 | yes | no | no | no | no | no | no |
| FR2| yes  | yes |  no | no  | no |  no | no |
| FR3| yes  | yes |  partially (only modify occupation) | partially (only modify occupation)  | no |  no | no |
| FR4 | yes | yes | no | no  | no  | partially (only register) |  no |
| FR5 | yes  | yes|  partially (handle reception) | no  | partially (handle tests) |  no | no |
| FR6 | yes  | yes |  no | partially (handle delivery)  | no |  partially (issue internal order) | no |
| FR7 | no  | no |  no | no  | no | no | yes |



## Non Functional Requirements
| ID        | Type        | Description  | Refers to |
| ------------- |:-------------:| :-----| -----:|
|  NFR1     | Usability | Application should be used with no specific training for the users | All FR |
|  NFR2     | Performance | All functions should complete in < 0.5 sec  | All FR |
|  NFR3     | Privacy | The data of a customer or a supplier should not be disclosed outside the application | All FR |
|  NFR4     | Domain | Position ID is the unique identifier of a position, 12 digits, and is derived from aisle (4digits) row (4 digits) col (4 digits), 4 first digits for aisle, middle 4 for row, last 4 for col | All FR |
|  NFR5     | Domain | SKU.id is a string of 12 digits | FR2 |
|  NFR6     | Domain | RFID is a string of 32 digits | FR3-5 |
|  NFR7     | Domain | Position Volume is expressed in cube meters | FR3 |
|  NFR8     | Domain | Position Weight is expressed in kilograms | FR3 |
|  NFR9     | Domain | Date Format is YYYY/MM/GG HH:MM | All FR |







# Use case diagram and use cases


## Use case diagram

```plantuml
left to right direction
actor Administrator as a
actor Clerk as ck
actor QualityCheckEmployee as qce
actor DeliveryEmployee as de
actor Manager as mngr
actor Supplier as sp
actor InternalCustomer as c
a -up-|> mngr


a --> (UC4 Manage users and rights)
a --> (UC2 Manage positions)
a --> (UC12 Manage Test Descriptors)
mngr --> (UC3 Manage issue of restock orders)
mngr --> (UC9.2 Manage internal orders acceptance)
mngr --> (UC6  Manage return order of SKU items)
(UC6  Manage return order of SKU items) --> sp
c --> (UC9.1 Manage internal orders creation)
(UC3 Manage issue of restock orders) --> sp
qce --> (UC5 Manage reception of restock Order)
ck --> (UC5 Manage reception of restock Order)
de --> (UC10 Manage internal orders delivery)
sp --> (UC11 Manage Items)

(EZWH) ..> (UC1 Manage SKUs) :include
(EZWH) ..> (UC2 Manage positions) :include
(EZWH) ..> (UC3-5 Manage restock orders) :include

(EZWH) ..> (UC4 Manage users and rights) :include

(EZWH) ..> (UC6  Manage return order of SKU items) :include
(EZWH) ..> (UC7 Authenticate authorize) :include
(EZWH) ..> (UC9-10 Manage internal orders) :include
(EZWH) ..> (UC11 Manage Items) :include
(EZWH) ..> (UC12 Manage Test Descriptors) :include

(UC3-5 Manage restock orders) .> (UC3 Manage issue of restock orders) :include
(UC3-5 Manage restock orders) .> (UC5 Manage reception of restock Order) :include
(UC5 Manage reception of restock Order) .> (UC5.1 - Manage reception of SKU Items of a restock Order) :include
(UC5 Manage reception of restock Order) .> (UC5.2 - Manage testing of SKU Items of a restock Order) :include
(UC5 Manage reception of restock Order) .> (UC5.3 - Manage acceptance of tested SKU Items of a restock Order) :include
(UC9-10 Manage internal orders) .> (UC9 Manage internal orders creation and acceptance) :include
(UC9-10 Manage internal orders) .> (UC10 Manage internal orders delivery) :include
(UC9 Manage internal orders creation and acceptance) .> (UC9.1 Manage internal orders creation) :include
(UC9 Manage internal orders creation and acceptance) .> (UC9.2 Manage internal orders acceptance) :include

```

## Use cases

### Use case 1, UC1 - Manage SKUs

| Actors Involved        | Administrator, Manager |
| ------------- |:-------------:|
|  Precondition |  |
|  Post condition |  |
|  Nominal Scenario |  Manager creates a new SKU S populating its fields  |
|  Variants     | S exists already, Manager modifies its fields  |
| | S is assigned to an existing ID , issue warning |

##### Scenario 1-1

| Scenario |  Create SKU S |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  Post condition     | S  into the system and with an assigned ID and a location  |
| Step#        | Description  |
|  1    |  M inserts new SKU description |  
|  2    |  M inserts new weight |
|  3    |  M inserts new volume |
|  4    |  M inserts new SKU notes |
|  5    |  M confirms the entered data |

##### Scenario 1-2

| Scenario |  Modify SKU location |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  | SKU S exists |
|  | Position P is not assigned to any SKU |
|  Post condition     | S.position = P |
| Step#        | Description  |
|  1    |  M searches S via ID |
|  2    |  M selects S's record |
|  3    | System provide free positions capable to store the SKU quantity |
|  4    |  M selects a new SKU position |
|  5    |  M confirms the modifications |

##### Scenario 1-3

| Scenario |  Modify SKU weight and volume |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  | SKU S exists |
|  Post condition     | Weight and or volume of S updated |
| Step#        | Description  |
|  1    |  M searches S via ID |
|  2    |  M selects S's record |
|  3    |  M selects new value for S's weight |
|  4    |  M selects new value for S's volume |
|  5    |  M confirms the modifications |

### Use case 2, UC2 - Manage Positions

| Actors Involved        | Administrator, Manager |
| ------------- |:-------------:|
|  Precondition | Manager M  logged in |
|  Post condition | Position created, modified or deleted |
|  Nominal Scenario |  M defines a new position P and its fields  |
|  Variants     | M modifies fields of an existing position |

##### Scenario 2-1

| Scenario |  Create position |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|  Post condition     | Position P is created with zero occupied weight and volume |
| Step#        | Description  |
|  1    |  M defines aisle ID, row and column for P |  
|  2    |  M defines positionID for P |
|  3    |  M defines max weight for P |
|  4    |  M defines max volume for P |
|  5    |  M confirms the inserted data |

##### Scenario 2-2

| Scenario |  Modify positionID of P |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||Position P exists|
|  Post condition     | P's positionID updated |
| Step#        | Description  |
|  1    |  M selects position P |  
|  2    |  M defines new positionID for P |
|  3   |  M confirms the inserted data |
| 4 | System updates aisleID, row and col|

##### Scenario 2-3

| Scenario |  Modify weight and volume of P |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||Position P exists|
|  Post condition     | P's weight and volume updated |
| Step#        | Description  |
|  1    |  M selects position P |  
|  2    |  M defines new weight for P |
|  3    |  M defines new volume for P |
|  4  |  M confirms the inserted data |

##### Scenario 2-4

| Scenario |  Modify aisle ID, row and column of P |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||Position P exists|
|  Post condition     | P's aisle ID, row and column updated |
| Step#        | Description  |
|  1    |  M selects position P |  
|  2    |  M defines new aisle ID for P |
|  3    |  M defines new row for P |
|  4    |  M defines new column for P |
|  5   |  M confirms the inserted data |
| 6 | System modify positionID |

##### Scenario 2-5

| Scenario |  Delete position P |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
||Position P exists|
|  Post condition     | Position P deleted |
| Step#        | Description  |
|  1    |  M selects position P |
|  2   |  M confirms the cancellation of P |

### Use case 3, UC3 - Manage issue of restock orders

| Actors Involved        | Manager |
| ------------- |:-------------:|
|  Precondition | SKU S exists |
|  Post condition | Restock Order RO for S exists  |
|  Nominal Scenario |  Manager creates new restock order RO for SKU S by selecting the supplier SP among those that supply S. |
|  Variants     | Creation of restock order, S does not exist, issue warning |
|  | Creation of restock order, no suppliers provide S, issue warning |
|  | Creation of restock order, not enough space in warehouse, issue warning|

##### Scenario 3-1

| Scenario |  Restock Order of SKU S issued by quantity |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| | SKU S exists |
|  Post condition     | Restock Order RO exists and is in ISSUED state  |
| | S.availability not changed |
| Step#        | Description  |
|  1    | M creates order RO |
|  2    |  M fills quantity of item to be ordered | 
|  3    |  M select supplier SP that can sastisfy order | 
|  4    |  M confirms inserted data |  
|  5    |  RO is recorded in the system in ISSUED state |

##### Scenario 3-2

| Scenario |  Restock Order of SKU S issued by supplier |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| | SKU S exists |
|  Post condition     | Restock Order RO exists and is in ISSUED state  |
| | S.availability not changed |
| Step#        | Description  |
|  1    | M creates order RO |
|  2    |  M select supplier SP | 
|  3    |  M fills quantity of item to be ordered | 
|  4    |  M confirms inserted data |  
|  5    |  RO is recorded in the system in ISSUED state |

### Use case 4, UC4 - Manage users and rights

| Actors Involved        | Administrator, Manager |
| ------------- |:-------------:|
|  Precondition | Administrator A logged in |
|  Post condition | User created, modified or deleted |
|  Nominal Scenario |  A defines a new user and its access rights  |
|  Variants     | A modifies role or access rights of an existing user |

##### Scenario 4-1

| Scenario |  Create user and define rights |
| ------------- |:-------------:| 
|  Precondition     | Admin A exists and is logged in |
|  Post condition     | Account X is created |
| Step#        | Description  |
|  1    |  A defines the credentials of the new Account X |  
|  2    |  A selects the access rights for the new account X |
|  3    |  A confirms the inserted data |

##### Scenario 4-2

| Scenario |  Modify user rights |
| ------------- |:-------------:| 
|  Precondition     | Admin A exists and is logged in |
|  | Account X exists |
|  Post condition     | X's rights updated |
| Step#        | Description  |
|  1    |  A selects account X  |
|  2    |  A selects the access rights for X |
|  3    |  A confirms the inserted data |

##### Scenario 4-3

| Scenario |  Delete user |
| ------------- |:-------------:| 
|  Precondition     | Admin A exists and is logged in |
|  | Account X exists |
|  Post condition     | Account X deleted |
| Step#        | Description  |
|  1    |  A selects account X  |
|  2    |  X deleted from the system |

### Use case 5, UC5 - Manage reception of restock order 
### Use case 5.1, UC5.1 - Manage reception of SKU Items of a restock Order

| Actors Involved        | Clerk, Quality Check Employee |
| ------------- |:-------------:|
|  Precondition     |    Restock order RO exists and state = DELIVERY    |
|  Post condition     |            State of restock order RO updated to DELIVERED       |
|  Nominal Scenario     |  Clerk receives order, tag with RFID each item.  |
|  Variants     |  RFID duplicated, issue warning |

##### Scenario 5-1-1

| Scenario |  Record restock order arrival  |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | SKU S exists |
| | SKU position is valid |
| | Restock Order RO exists and is in DELIVERY state  |
|  Post condition     | RO is in DELIVERED  state  |
| | Each sku item has an RFID |
| Step#        | Description  |
|  1    |  RO arrives to the shop | 
|  2    | C records every item in the system with a new RFID | 
|  3    |  System stores RFID of SKU Items |
|  4    |  RO is updated in the system in DELIVERED state |

### Use case 5.2, UC5.2 - Manage testing of SKU Items of a restock Order

| Actors Involved        | Quality Check Employee |
| ------------- |:-------------:|
|  Precondition     |    Restock order RO exists and state = DELIVERED    |
| | Every Sku Item has an RFID associated |
|  Post condition     |            State of restock order RO updated to TESTED       |
| | Every Sku Item has a set of test result associated |
|  Nominal Scenario     |  Quality employee performs tests on all sku items of RO. All items pass quality tests.  |
|  Variants     |  All items do not pass quality test|
|      |  Some items do not pass tests while the remaining part yes.| 

##### Scenario 5-2-1

| Scenario |  Record positive test results of all SKU items of a RestockOrder |
| ------------- |:-------------:| 
|  Precondition  | Quality Employee Q exists and is logged in |
| | SKU S exists |
| | SKU position is valid |
| | Every SKU Item has an RFID attached |
| | Restock Order RO exists and is in DELIVERED state  |
|  Post condition     | RO is in TESTED state  |
| | Every SKU Item has a list of test results attached |
| Step#        | Description  |
|  1    |  Q performs quality test on every SKU item  |
|  2    |  Q records positive tests result in the system for all SKU items |
|  3    |  RO is updated in the system in TESTED state |

##### Scenario 5-2-2

| Scenario |  Record negative test results of all SKU items of a RestockOrder |
| ------------- |:-------------:| 
|  Precondition  | Quality Employee Q exists and is logged in |
| | SKU S exists |
| | SKU position is valid |
| | Every SKU Item has an RFID attached |
| | Restock Order RO exists and is in DELIVERED state  |
|  Post condition     | RO is in TESTED state  |
| | Every SKU Item has a list of test results attached |
| Step#        | Description  |
|  1    |  Q performs quality test on every SKU item  |
|  2    |  Q records negative tests result in the system for all SKU items |
|  3    |  RO is updated in the system in TESTED state |

##### Scenario 5-2-3

| Scenario |  Record negative and positive test results of all SKU items of a RestockOrder |
| ------------- |:-------------:| 
|  Precondition  | Quality Employee Q exists and is logged in |
| | SKU S exists |
| | SKU position is valid |
| | Every SKU Item has an RFID attached |
| | Restock Order RO exists and is in DELIVERED state  |
|  Post condition     | RO is in TESTED state  |
| | Every SKU Item has a list of test results attached |
| Step#        | Description  |
|  1    |  Q performs quality test on every SKU item  |
|  2    |  Q records negative and positive tests result in the system for SKU items |
|  3    |  RO is updated in the system in TESTED state |

### Use case 5.3, UC5.3 - Manage acceptance of tested SKU Items of a restock Order

| Actors Involved        | Clerk |
| ------------- |:-------------:|
|  Precondition     |    Restock order RO exists and state = TESTED    |
| | Every Sku Item has an RFID and a set of test result associated|
|  Post condition     |            State of restock order RO updated to COMPLETED or COMPLETEDRETURN       |
| | Occupation of position P increases |
|  Nominal Scenario     |  All items have passed quality tests and are stocked in warehouse. Availability of S is updated.  |
|  Variants     |  All items have not passed quality test and aren't stocked|
|      |  Some items have not passed tests and aren't stocked while the remaining part yes.|
|       | Not enough space in the positions assigned to SKU, issue warning | 

##### Scenario 5-3-1

| Scenario |  Stock all SKU items of a RO |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | Every SKU Item has an RFID and a list of positive testResult attached |
| | SKU S exists |
| | SKU position is valid |
| | Restock Order RO exists and is in TESTED state  |
|  Post condition     | RO is in COMPLETED state  |
| | S.units += RO.units |
| | P.volume -= RO.units * S.volume |
| | P.weight -= RO.units * S.weight |
| Step#        | Description  |
|  1    |  Clerk selects all the RFIDs to stock |
|  2   |  System records every SKU item in a position |
|  3    |  System updates occupation of position P    |
|  4    |  System updates availability of S |
|  5    |  RO is updated in the system in COMPLETED state |

##### Scenario 5-3-2

| Scenario |  Stock zero SKU items of a RO |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | Every SKU Item has an RFID and a list of negative testResult attached |
| | SKU S exists |
| | SKU position is valid |
| | Restock Order RO exists and is in TESTED state  |
|  Post condition     | RO is in COMPLETEDRETURN state  |
| Step#        | Description  |
|  1    |  Clerk selects all the RFIDs |
|  2   |  System checks negative test results for every SKU item |
|  3    |  RO is updated in the system in COMPLETEDRETURN state |


##### Scenario 5-3-3

| Scenario |  Stock some SKU items of a RO |
| ------------- |:-------------:| 
|  Precondition     | Clerk C exists and is logged in |
| | Every SKU Item has an RFID and a list of positive and negative testResult attached |
| | SKU S exists |
| | SKU position is valid |
| | Restock Order RO exists and is in TESTED state  |
|  Post condition     | RO is in COMPLETEDRETURN state  |
| | S.units += RO.units |
| | P.volume -= RO.units * S.volume |
| | P.weight -= RO.units * S.weight |
| Step#        | Description  |
|  1    |  Clerk selects all the RFIDs to stock |
|  2   |  System records only SKU items with all testResult positive in a position |
|  3    |  System updates occupation of position P    |
|  4    |  System updates availability of S |
|  5    |  RO is updated in the system in COMPLETEDRETURN state |


### Use case 6, UC6 - Manage return order of SKU items

| Actors Involved        |  Manager |
| ------------- |:-------------:|
|  Precondition     | Restock order RO exists and state = COMPLETEDRETURN |
|  Post condition     | SKU items are returned. |
|  Nominal Scenario   | Manager starts a new return order REO inserting the RO's unique number. Manager adds all the RFID of all SKU items to be returned and issue return order. Supplier SP is informed. Supplier SP collect products.|
|  Variants     | Restock order number does not exists, issue warning |

##### Scenario 6-1

| Scenario |  Return order of SKU items that failed quality test |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| | SKU S exists |
| | Restock order RO exists and is in state = COMPLETEDRETURN |
| | Restock order RO has at least N units of S that not passed quality tests, N>0 |
|  Post condition     | Return Order REO registered into system  |
| | Every SKU item returned is not available |
| Step#        | Description  |
|  1    |  M inserts RO.ID |
|  2    |  Return order starts |  
|  3    |  System provide RFID of SKU items that not passed quality tests |
|  4    |  M adds all items to REO |
|  5    |  M confirms the inserted data |
|  6    |  System set all SKU items in state not available |
|  7    |  Supplier is notified by the system, REO is registered |

##### Scenario 6-2

| Scenario |  Return order of any SKU items |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| | SKU S exists |
| | Restock order RO exists and is in state = COMPLETEDRETURN |
| | Restock order RO has at least 1 units of S that passed quality tests and need to be returned anyway |
|  Post condition     | Return Order REO registered into system  |
| | RFID for every SKU item returned is deleted |
| | Availability of sku and of position updated |
| Step#        | Description  |
|  1    |  M inserts RO.ID |
|  2    |  Return order starts |  
|  3    |  System provide RFID of SKU items that not passed quality tests |
|  4    |  System provide RFID of SKU items that passed quality tests but need to be returned (eg wrong order by manager) |
|  5    |  M adds all items to REO |
|  6    |  M confirms the inserted data |
|  7    |  System set all SKU items in state not available |
|  8    |  System update availability of SKU (decrease) and of position (increase) |
|  9    |  Supplier is notified by the system, REO is registered |


### Use case 7, UC7 - Authenticate, authorize

| Actors Involved        | Administrator, Manager, Customer, Clerk, Delivery Employee, Quality Check Employee, Supplier  |
| ------------- |:-------------:|
|  Precondition     |                                                       |
|  Post condition     |                                 |
|  Nominal Scenario     | Login: user enters credentials, system checks credentials, user is authenticated   |
|  Variants     | Login, credentials wrong, user not authenticated |
|  | Logout |

##### Scenario 7-1

| Scenario |  Login |
| ------------- |:-------------:| 
|  Precondition     | Account  for User U existing  |
|  Post condition     | U logged in  |
| Step#        | Description  |
|  1    |  User inserts his username |
|  2    |  User inserts his password |
|  3    |  User logged in,  system shows the functionalities offered by the access priviledges of  U |


##### Scenario 7-2

| Scenario |  Logout |
| ------------- |:-------------:| 
|  Precondition     | U logged-in  |
|  Post condition     | U logged-out  |
| Step#        | Description  |
|  1    |  U logs out |
|  2    |  The system shows the login/sign in page |  


### Use case 9, UC9 - Manage internal orders creation and acceptance

| Actors Involved        |  Internal Customer, Manager |
| ------------- |:-------------:|
|  Precondition     | There are SKUs available in the WH |
|  Post condition     | Internal Order IO is accepted or refused |
|  Nominal Scenario   | Customer surfs the available SKUs and then, she records the quantity of each SKU she wants to order. She send the internal order request. Manager check internal order IO and accepts it Quantity of SKUs available are updated. |
|  Variants     | Order is refused because no availability. |

##### Scenario 9-1 

| Scenario |  Internal Order IO accepted |
| ------------- |:-------------:| 
|  Precondition     | Customer C exists and is logged in |
|   | Manager M exists and is logged in |
| | SKUs exists and have enough units to complete the order |
|  Post condition     | For each SKU ordered: S.availability -= N |
|| IO in state = ACCEPTED|
|| Availability of SKU decreases |
| | Availability of Position increases |
| Step#        | Description  |
|  1    |  C starts a new Internal Order |  
|  2    |  C adds every SKU she wants in every qty to IO |
|  3    |  C confirms IO  |
|  4    |  System issue IO with status = ISSUED |
|  5    |  System decreases availability of every SKU ordered and increases position|
|  6    |  M checks IO and accepts it   |
|  7    |  System update IO status in ACCEPTED |

##### Scenario 9-2

| Scenario |  Internal Order IO refused |
| ------------- |:-------------:| 
|  Precondition     | Customer C exists and is logged in |
|   | Manager M exists and is logged in |
| | SKUs exists and have enough units to complete the order |
| Post condition  | IO in state = REFUSED|
| Step#        | Description  |
|  1    |  C starts a new Internal Order |  
|  2    |  C adds every SKU she wants in every qty to IO |
|  3    |  C confirms IO  |
|  4    |  System issue IO with status = ISSUED |
|  5    |  System decreases availability of every SKU ordered and increases positon occupation |
|  6    |  M checks IO and refuses it   |
|  7    |  System increases availability of every SKU ordered and decreases position occupation |
|  8   |  System update IO status in REFUSED |

##### Scenario 9-3

| Scenario |  Internal Order IO cancelled |
| ------------- |:-------------:| 
|  Precondition     | Customer C exists and is logged in |
| | SKUs exists and have enough units to complete the order |
| Post condition  | IO in state = CANCELLED |
| Step#        | Description  |
|  1    |  C starts a new Internal Order |  
|  2    |  C adds every SKU she wants in every qty to IO |
|  3    |  C confirms IO  |
|  4    |  System issue IO with status = ISSUED |
|  5    |  System decreases availability of every SKU ordered and increases positon occupation |
|  6    |  C cancels order   |
|  7    |  System increases availability of every SKU ordered and decreases position occupation |
|  8    |  System update IO status in CANCELLED |


### Use case 10, UC10 - Manage internal orders delivery

| Actors Involved        |  Delivery Employee |
| ------------- |:-------------:|
|  Precondition     | IO is in state ACCEPTED |
|  Post condition     | IO in state COMPLETED |
|  Nominal Scenario   | Delivery Employee select (system provide) with a FIFO criterion RFIDs of skuItems available. System modify availability of sku items from warehouse, and updates state of IO |
|  Variants     | All items have the same restock date, select randomly which one to pick. |

##### Scenario 10-1 

| Scenario |  Internal Order IO Completed |
| ------------- |:-------------:| 
|  Precondition     | Delivery Employee D exists and is logged in |
|   | Internal Order IO exists and State = ACCEPTED |
| | Position P exists |
|  Post condition     | IO in state = COMPLETED  |
| | SKU Items delivered setted as not available from the system |
| Step#        | Description  |
|  1    |  D selects Internal Order IO  |  
|  2    |  System provides RFID of SKU items to be delivered |
|  3    |  D collect and delivers SKU items from warehouse  |
|  4    |  System set every sku item as not available |
|  5    |  System update IO state in COMPLETED   |

### Use case 11, UC11 - Manage Items

| Actors Involved        | Supplier |
| ------------- |:-------------:|
|  Precondition |  |
|  Post condition |  |
|  Nominal Scenario |  Supplier creates a new Item I populating its fields  |
|  Variants     | I exists already, Supplier modifies its fields  |
| | I is assigned to an existing ID , issue warning |

##### Scenario 11-1

| Scenario |  Create Item I |
| ------------- |:-------------:| 
|  Precondition     | Supplier S exists and is logged in |
|  Post condition     | I into the system and with an assigned ID  |
| Step#        | Description  |
|  1    |  S inserts new Item description |  
|  2    |  S inserts identifier of corresponding SKU |
|  3    |  S inserts new price |
|  4    |  S confirms the entered data |


##### Scenario 11-2

| Scenario |  Modify Item description and price |
| ------------- |:-------------:| 
|  Precondition     | Supplier S exists and is logged in |
|  | Item I exists |
|  Post condition     | Description and or price of I updated |
| Step#        | Description  |
|  1    |  S searches I via ID |
|  2    |  S selects I's record |
|  3    |  S selects new value for I's description |
|  4    |  S selects new value for I's price |
|  5    |  S confirms the modifications |

### Use case 12, UC12 - Manage Test Descriptors

| Actors Involved        | Administrator, Manager |
| ------------- |:-------------:|
|  Precondition | Manager M  logged in |
|  Post condition | Test description created, modified or deleted |
|  Nominal Scenario |  M defines a new Test description T and its fields  |
|  Variants     | M modifies fields of an existing Test description T |

##### Scenario 12-1

| Scenario |  Create test description |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
| | SKU S exists |
|  Post condition     | Test description is created |
| Step#        | Description  |
|1| M defines name for T |
| 2 |M selects S for T |
|  3    |  M defines procedure description for T |  
|  4    |  M confirms the inserted data |

##### Scenario 12-2

| Scenario |  Update test description |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|       | Test description T exists |
|  Post condition     | Test description updated |
| Step#        | Description  |
|  1    |  M selects test description T |  
| 2     |  M updates procedure description|
|  3    |  M confirms the updated data |

##### Scenario 12-3

| Scenario |  Delete test description |
| ------------- |:-------------:| 
|  Precondition     | Manager M exists and is logged in |
|       | Test description T exists |
|  Post condition     | Test description deleted |
| Step#        | Description  |
|  1    |  M selects test description T |  
|  2    |  M confirms the cancellation of T |


# Glossary

```plantuml
top to bottom direction

class Supplier {
  ID
  name
}

class Customer {
  ID
  name
  surname
}

class Item {
  ID
  description
  price
}

class A {
  quantity
}

class RestockOrder {
  ID
  issue date
  state [ISSUED - DELIVERY - DELIVERED - TESTED - COMPLETEDRETURN - COMPLETED]
}

class TransportNote {
  Shipment date
}

class ReturnOrder {
  ID
  Return date
}

class SKU {
  ID
  description
  weight
  volume
  price
  notes
}

class Inventory

class SKUItem {
  RFID
  Available [0 - 1]
}

class AA {
  quantity
}

class TestDescriptor {
  ID
  name
  procedure description
}

class AAA {
  date of stock 
}

class TestResult {
  ID
  date
  result boolean
}

class Warehouse

class Position {
  positionID
  aisle 
  row
  col
  max weight
  max volume
  occupied weight
  occupied volume
}

class InternalOrder {
  date
  from
  state [ISSUED - ACCEPTED - REFUSED - CANCELED - COMPLETED]
}

Warehouse -- "*" Position
Supplier -- "*" Item : sells
Supplier -- "*" RestockOrder
RestockOrder -- "*" Item
RestockOrder -- "0..1" TransportNote
RestockOrder -- "0..1" ReturnOrder : refers
RestockOrder -- "*" SKUItem
SKUItem "*" -- "0..1" ReturnOrder
SKU -- "*" SKUItem
SKU -- "*" Item : corresponds to 
Inventory -- "*" SKU
SKU "*" -- "*" TestDescriptor
TestDescriptor -- "*" TestResult
SKU "1" -- "1" Position: must be placed in
InternalOrder -- "*" SKU
InternalOrder "0..1" -- "*" SKUItem
SKUItem -- "*" TestResult
SKUItem "*" -- "0..1" Position
Customer -- "*" InternalOrder : places

(RestockOrder, Item) .. A
(InternalOrder, SKU) .. AA
(SKUItem, Position) .. AAA

note "positionID is the unique identifier of a position, 12 digits (only numbers),\n and is derived from the identifiers of aisle, row, col.  4 first digits for aisle, 4 for row, 4 for col " as N4
N4 .. Position

note "ISSUED = Restock order created\nDELIVERY = Supplier ship the order\nDELIVERED = order is received at warehouse\nTESTED = products of order have been tested\nCOMPLETEDRETURN = there is at least 1 item that hasn't passed tests\nCOMPLETED = all items have passed tests" as N5
N5 .. RestockOrder

note "ISSUED = Internal Order created\nACCEPTED = Int Order accepted from manager\nREFUSED= I.O. refused from manager\nCANCELED = I.O. canceled from internal customer\nCOMPLETED= I.O. delivered to internal customer" as N6
N6 .. InternalOrder

note "bolla di accompagnamento " as N1  
N1 .. TransportNote

note "The ID of SKU is internal in the company " as N2  
N2 .. SKU

note " When items from a restock order are returned\n we suppose there's a single return order containing\n all items to be returned " as N3  
N3 .. ReturnOrder

```


# System Design

EZWh is a server side application, split in backend (that offers http / REST APIs) and a front end (that calls the APIs and implements the presentation of the application).  
```plantuml
class EZWHSystem


class EZWHFrontEnd
class EZWHBackEnd

EZWHSystem o-- EZWHFrontEnd
EZWHSystem o-- EZWHBackEnd
```

# Deployment Diagram
Client-Server application model. All user access the application with a browser

```plantuml
artifact "Browser" as b1
artifact "Browser" as b2
artifact "EZWHFrontEnd" as ezwhF
artifact "EZWHBackEnd" as ezwhB
node "Server" as s

node "PC Employee" as pe

node "PC Supplier" as ps
s -- ezwhF : "Deploy"
s -- ezwhB : "Deploy"
s --- pe :"Internet"
s -- ps

s -- ps : "Internet"
pe -- b1 : "Deploy"
ps -- b2 : "Deploy"


```

# Notes 

EZWH in a real setting should include (as system components) or interact with (as external actors) a positionID reader (for positions), a rfid reader (for skuitems), email gateway (for sending orders). For simplicity these components are simulated: through the APIs positionIDs and rfids are directly introduced as numbers or strings, emails are not sent (and orders just created internally).

Further, for simplicity the actors Administrator and Manager are merged (Manager has the same capabilities as Administrator)
