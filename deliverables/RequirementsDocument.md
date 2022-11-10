
# Requirements Document 


Authors: Francesco Sorrentino, Lorenzo Gangemi, Andrea Aureli, Ma Yufei

Date: 12/04/2022

Version: 1.0

# Contents

- [Informal description](#informal-description)
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
    	+ [Relevant scenarios](#relevant-scenarios)
- [Glossary](#glossary)
- [System design](#system-design)
- [Deployment diagram](#deployment-diagram)

# Informal description
Medium companies and retailers need a simple application to manage the relationship with suppliers and the inventory of physical items stocked in a physical warehouse. 
The warehouse is supervised by a manager, who supervises the availability of items. When a certain item is in short supply, the manager issues an order to a supplier. In general the same item can be purchased by many suppliers. The warehouse keeps a list of possible suppliers per item. 

After some time the items ordered to a supplier are received. The items must be quality checked and stored in specific positions in the warehouse. The quality check is performed by specific roles (quality office), who apply specific tests for item (different items are tested differently). Possibly the tests are not made at all, or made randomly on some of the items received. If an item does not pass a quality test it may be rejected and sent back to the supplier. 

Storage of items in the warehouse must take into account the availability of physical space in the warehouse. Further the position of items must be traced to guide later recollection of them.

The warehouse is part of a company. Other organizational units (OU) of the company may ask for items in the warehouse. This is implemented via internal orders, received by the warehouse. Upon reception of an internal order the warehouse must collect the requested item(s), prepare them and deliver them to a pick up area. When the item is collected by the other OU the internal order is completed. 

EZWH (EaSy WareHouse) is a software application to support the management of a warehouse.



# Stakeholders


| Stakeholder name  | Description | 
| ----------------- |:-----------:|
|  Manager             |  Supervise the availability of items: checks and requests items if needed.    | 
|  Quality Office      |  Quality check the items, through tests, that are received from suppliers     |
|  Quality Moderator   |  Quality Office's employee.													   |
|  Storage             |  It is where the items are stored: the free space has to be traced            |
|  OU                  |  Organizational unit: it's part of the company and can makes internal orders  |
|  OU Manager          |  Manager of an Organizational Unit (OU)									   |
|  Company             |  It's the company owner of the warehouse                                      |
|  Supplier            |  Supply the items when they are requested by the company                      |
|  Inventory Database  |  It's where all the data are stored                                           |
|  Pickup area         |  It's where the items are collected 										   |
|  Transporter         |  The person delivering the items                                  			   |
|  Administrator       |  Adds actors to the sistem and provide roles and permissoins       			   |  
|  Warehouse Worker    |  It's a worker in the warehouse.										       |  


# Context Diagram and interfaces

## Context Diagram
\<Define here Context diagram using UML use case diagram>

![](assets/misc/ContextDiagram.png)

\<actors are a subset of stakeholders>

## Interfaces
\<describe here each interface in the context diagram>

\<GUIs will be described graphically in a separate document>

| Actor | Logical Interface | Physical Interface  |
| ------------- |:-------------:| -----:|
|  OU Manager		   |  GUI    |  Keyboard + mouse  |
|  Manager  		   |  GUI    |  Keyboard + mouse  |
|  Administrator       |  GUI    |  Keyboard + mouse  |
|  Quality Moderator   |  GUI    |  Keyboard + mouse  |
|  Warehouse Worker    |  GUI    |  Keyboard + mouse  |
|  Supplier            |  Email  |  Keyboard + mouse  |

# Stories and personas
\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

1.Warehouse Manager:Rebecca is 40 ,is a manager of a warehouse.For work she drive to the warehouse every day when she arrive at the warehouse ,she should Check the goods on the shelves that follow the information of the EzWh system.If she finds some goods are not enough she will create a new external order,in this order she should select the supplier she want to contact with, and after insert all needed stuff ,click the “notify” button，the correspond supplier will receive an email,after those goods are arrive,she will print arrival notice first,it will notice Quality office that they should check goods,if they confirm receipt of goods,system will print receipt ,the goods information will be updated.If some time she got a internal OU massage,she will print Print delivery order also,and the goods quantity will update automatically,then take out the goods at the corresponding position shown in the system,and bring them to specific area.

2.Quality office:David is 35,works in the quality office,as a quality inspector,every time system notice him a batch of goods received he need to decide whether check their quality or maybe check some of them randomly.

3.OU Manager: Anna is 26, she works as a manager in the OU.The mainly task of her is check if there are items are needed by some departments,and then issuing orders to the Warehouse department. When she enter into the EzWh system ,she just need to select every single item and then issues an internal order,after that she can search a specific history internal order and check the detail of it.

4.Administrator:John is 56 as the manager of IT department,the main part of his work is manage the accounts,for example,every time a new manager is hired,he needs to create a new account for the new manager,and then give him permission corresponding to his department or some time a person leave ,so he need to delete this account.

5.Warehouse worker:Bob is 35, he has been working in a warehouse for 5 years.  His main job is carrying items (by forklift or manually ) from one place to another place according to the manager’s requirements. He cannot hold his phone in hand while working in normal situation,but some time he can check the position of some items through the system which is the only permission of his account also, he has rich working experience,and knows the exact position of each area and shelf. When the manager told him some goods need to be moved he will do it,he prefers to see the instruction which can let him easy to understand.

\<stories will be formalized later as scenarios in use cases>


# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

| ID         | Description  |
| ------------- |:-------------:| 
|  FR1     	 | Manage account|
|  FR1.1   	 | Create |
|  FR1.2   	 | Read(check account info) |
|  FR1.3   	 | Update(update account info and manage permissions)   |
|  FR1.4   	 | Delete(delete account)   |
|  FR1.5   	 | List accounts |
|  FR1.6   	 | Search accounts |
|  FR2     	 | Authentication   |
|  FR2.1   	 | Login   |
|  FR2.1   	 | Logout   |
|  FR3       | Manage items |
|  FR3.1     | Check item supply |
|  FR3.2     | Add new item or delete an item |
|  FR3.4     | Update item info and position |
|  FR3.5     | Order an item |
|  FR3.6     | Manage suppliers for an item |
|  FR3.6.1   | Add suppliers for an item |
|  FR3.6.2   | Delete suppliers for an item |
|  FR3.7     | List items |
|  FR3.8     | Search items |
|  FR4       | Manage physical space |
|  FR4.1     | Update available space |
|  FR4.2     | Check for available space |
|  FR5       | Manage internal orders |
|  FR5.1     | Submit if available |
|  FR5.2     | List orders |
|  FR5.3     | Search orders |
|  FR6       | Make an internal order |
|  FR6.1     | Select items |
|  FR6.2     | Place the order |
|  FR7       | Check quality |
|  FR7.1     | List test items |
|  FR7.2     | Skip | 
|  FR7.3     | Select Accept or Reject|  
|  FR8    	 | Manage suppliers |
|  FR8.1     | Add new supplier |    
|  FR8.2     | Delete a supplier |    
|  FR8.3     | Update supplier's info |    


## Non Functional Requirements

\<Describe constraints on functional requirements>

| ID        | Type (efficiency, reliability, ..)           | Description  | Refers to |
| ------------- |:-------------:| :-----:| -----:|
|  NFR1     | Privacy   | No personal data should be disclosed to anyone else except the authorized roles (manager) | All FR |
|  NFR2     | Reliability | <5 defects per year | All FR |
|  NFR3     | Efficiency  | <0.5 sec for all functions | All FR |
| NFR4 | Usability | It’s easy to learn to use the product | All FR | 
| NFR5 | Maintainability  | It’s easy to update software function | All FR | 

# Use case diagram and use cases


## Use case diagram
\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

![](assets/misc/UseCaseDiagram1.png)

\<next describe here each use case in the UCD>
### Use case 1, UC1 - Authenticate to the system
| Actors Involved        | Administrator, Manager, Quality Moderator, OU Manager  |
| ------------- |:-------------:| 
|  Precondition     | Account for the actor exists. |
|  Post condition     | Actor is logged in. |
|  Nominal Scenario     | Actor connects to the application. Actor inserts correct actorname and password. The system checks the combination actorname/password. The credentials are valid. |
|  Variants     | actorname or password are incorrect, the Actor is not logged in. |


##### Scenario 1.1 

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

##### Scenario 1.1

| Scenario 1.1 | actor is authenticated |
| ------------- |:-------------:| 
|  Precondition     | Account for the actor exists |
|  Post condition     | Actor is logged in  |
| Step#        | Description  |
|  1     | Actor connects to the authentication page of the application |  
|  2     | Actor inserts actorname  |
|  3     | Actor inserts password |
|  4     | The system checks that both actorname and password are correct|
|  5     | The actor is authenticated |
|  6     | The actor has access to his personal interface |

##### Scenario 1.2

| Scenario 1.2 | actor is not authenticated |
| ------------- |:-------------:| 
|  Precondition     | Account for the actor exists |
|  Post condition     | Actor is not logged in |
| Step#        | Description  |
|  1     | Actor connects to the authentication page of the application |  
|  2     | Actor inserts actorname |
|  3     | Actor inserts password |
|  4     | The system checks that both actorname and password are correct |
|  5     | Authentication fails (wrong actorname/password combination) |
|  6     | An error message is shown to the Actor |


### Use case 2, UC2 - Log out
| Actors Involved        | Administrator, Manager, Quality Moderator, Manager |
| ------------- |:-------------:| 
|  Precondition     | Actor is logged in. |
|  Post condition     | Actor is logged out. |
|  Nominal Scenario     | Actor presses the button to exit his personal page. The system terminates the session of the actor. He is logged out. |


##### Scenario 2.1
| Scenario 2.1 | actor is logged out |
| ------------- |:-------------:| 
|  Precondition     | Actor is logged in |
|  Post condition     | Actor is logged out  |
| Step#        | Description  |
|  1     | Actor presses the button to exit his personal page  |
|  2     | Actor is logged out |


### Use case 3, UC3 - Add an account
| Actors Involved        | Administrator |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. The account to be created does not exist. |
|  Post condition     | Account is created. |
|  Nominal Scenario     | Administrator inserts the account info and permissions. |
| Variants |  |

##### Scenario 3.1
| Scenario 3.1 | Account is added |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. |
|  Post condition     | Account is created. |
| Step#        | Description  |
|  1     | There is a new actor that needs a personal page in the application |  
|  2     | The Administrator starts the creation of a new account |
|  3     | The Administrator inserts information and permissions of the actor in the system |
|  4     | The Administrator creates actorname and password for the account |
|  5     | The System checks if already exists an account with that actorname.  |
|  6     | The Administrator confirms the operation |

### Use case 4, UC4 - Delete an account
| Actors Involved        | Administrator |
| ------------- |:-------------:| 
| Precondition | Administrator is logged in the system. The account to be deleted exists.|
| Post condition | Account is deleted. |
| Nominal scenario | Administrator selects the account to delete. Administrator confirms operation.|
| Variants |  |

##### Scenario 4.1
| Scenario 4.1 | Account is deleted |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. The account to be deleted exists. |
|  Post condition     | Account is deleted. |
| Step#        | Description  |
|  1     | A actor no longer needs his personal page in the application |  
|  2     | The Administrator selects the account to delete |
|  3     | The Administrator confirms the operation |


### Use case 5, UC5 - Update an account
| Actors Involved        | Administrator |
| ------------- |:-------------:| 
| Precondition | Administrator is logged in the system. The account to be updated exists.|
| Post condition | Account is updated. |
| Nominal scenario | Administrator selects the account to update. Administrator inserts the new/modified information. Administrator confirms operation. |
| Variants |  |

##### Scenario 5.1
| Scenario 5.1 | Account is updated |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. The account to be updated exists. |
|  Post condition     | Account is updated. |
| Step#        | Description  |
|  1     | actor's info or actor's permissions need to be changed |  
|  2     | The Administrator selects the account to update |
|  3     | The Administrator inserts the actor's new info and permissions in the system |
|  4     | The Administrator confirms the operation |

### Use case 6, UC6 - Search an account
| Actors Involved        | Administrator |
| ------------- |:-------------:| 
| Precondition | Administrator is logged in and he wants to search for an account.|
| Post condition | Administrator finds the account that he was searching for.   |
| Nominal scenario | Administrator searchs the account in the system. Administrator finds the account. |
| Variants |  |

##### Scenario 6.1
| Scenario 6.1 | Account is found |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. The account that the Administrator is searching for exists |
|  Post condition     | The system returns the account to the Administrator |
| Step#        | Description  |
|  1     | The Administrator types the name of the OU or the quality moderator |
|  2     | The System searchs for an account linked to that name |
|  3     | The System finds the account and returns it to the Administrator  |
|  4     | The account is shown in the personal page of the Administrator |

##### Scenario 6.2
| Scenario 6.2 | Account is not found |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system. The account that the Administrator is searching for doesn't exist |
|  Post condition     | The system returns an error message to the Administrator |
| Step#        | Description  | 
|  1     | The Administrator types the name of the OU or the quality moderator |
|  2     | The System searchs for an account linked to that name |
|  3     | The System doesn't find any accounts  |
|  4     | An error message is shown in the personal page of the Administrator |

### Use case 7, UC7 - List accounts
| Actors Involved        | Administrator |
| ------------- |:-------------:| 
| Precondition | Administrator is logged in and he wants the list of all the accounts.|
| Post condition | The complete list of the account is shown to the Administrator. |
| Nominal scenario | Administrator searchs the list of all the accounts in the system. The System shows the list |
| Variants |  |

##### Scenario 7.1
| Scenario 7.1 | Account list is shown |
| ------------- |:-------------:| 
|  Precondition     | Administrator is logged in the system and he wants the list of all the accounts |
|  Post condition     | The system returns the list of all the accounts to the Administrator |
| Step#        | Description  |
|  1     | The Administrator searchs for the list of all the accounts registered in the application |
|  2     | The System returns the list of all the accounts to the Administrator |


### Use case 8, UC8 - Add new item

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to add doesn't already exist. |
|  Post condition 	| The item is added in the system |
|  Nominal Scenario | Manager adds a new item and populates its fields. |

##### Scenario 8.1
| Scenario 8.1 | New item is added|
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to add doesn't already exist. |
|  Post condition     | The item is added in the system. |
| Step#        | Description  |
|  1     | The Warehouse Manager inserts info for a new item to be added in the System. |
|  2     | The item is added into the System. |


### Use case 9, UC9 - Delete item

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to delete exists. |
|  Post condition 	| The item is deleted in the system. |
|  Nominal Scenario | Warehouse Manager deletes an item which is not needed anymore |


##### Scenario 9.1
| Scenario 9.1 | Item is deleted |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to delete exists. |
|  Post condition     | The item is deleted in the system. |
| Step#        | Description  |
|  1     | The Warehouse Manager presses the button to delete the item from the System. |
|  2     | The item is deleted from the System. |


### Use case 10, UC10 - Modify item's info

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to update exists. |
|  Post condition 	| Item's info are modified |
|  Nominal Scenario | Warehouse Manager selects an item and modifies its info. |
|  Variants  		| |

##### Scenario 10.1
| Scenario 10.1 | Item's info are modified |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The item he wants to update exists. |
|  Post condition     | The item info are updated. |
| Step#        | Description  | 
|  1     | The Warehouse Manager selects an item to update its info. |
|  2     | The item is modified. |

### Use case 11, UC11 - Order an item

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The item to order exists in the System. |
|  Post condition 	| The order for the item is sent to the suppliers. |
|  Nominal Scenario | The Warehouse Manager selects an item. He selects the suppliers that can provide that item. He decides the quantity of items and he sends the order to the suppliers. |

##### Scenario 11.1
| Scenario 11.1 | An item is ordered |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The item to order exists in the System. |
|  Post condition     | The order for the item is sent to the suppliers. |
| Step#        | Description  |  
|  1     | The Warehouse Manager selects an item. |
|  2     | The Warehouse Manager selects the suppliers that can provide that item. |
|  3     | The Warehouse Manager sets a quantity of items to order. |
|  4     | The Warehouse Manager sends the order to the suppliers. |

### Use case 12, UC12 - Add new suppliers for an item

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the System. The item exists in the System. |
|  Post condition 	| Suppliers are added to the list of suppliers for that item. |
|  Nominal Scenario | Warehouse Manager selects an item. He adds suppliers to the list of suppliers that can provide that item to the warehouse. |

##### Scenario 12.1 

| Scenario 12.1 | Add new suppliers for an item |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the System. The item exists in the System. |
|  Post condition     | Suppliers are added to the list of suppliers for that item. |
| Step#        | Description  |
|  1     | The Warehouse Manager selects an item. |  
|  2     | The System shows the list of suppliers.  |
|  3     | The Warehouse Manager selects which suppliers he wants to add.  |
|  4     | The Warehouse Manager adds new suppliers for that item.  |
|  5     | The Warehouse Manager confirms the operation.  |

### Use case 13, UC13 - Delete suppliers for an item

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the System. The item exists in the System. |
|  Post condition 	| Suppliers are deleted from the list of suppliers for that item. |
|  Nominal Scenario | Warehouse Manager selects an item. He deletes suppliers from the list of suppliers that can provide that item to the warehouse. |

##### Scenario 13.1 

| Scenario 13.1 | Delete new suppliers for an item |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the System. The item exists in the System. |
|  Post condition     | Suppliers are added to the list of suppliers for that item. |
| Step#        | Description  |
|  1     | The Warehouse Manager selects an item. |  
|  2     | The System shows the list of suppliers for that item.  |
|  3     | The Warehouse Manager selects which suppliers he wants to delete.  |
|  5     | The Warehouse Manager confirms the operation.  |


### Use case 14, UC14 - List items

| Actors Involved | Warehouse Manager, OU, Warehouse Worker |
| ------------- |:-------------:|
|  Precondition     | The actor is logged in. |
|  Post condition 	| The list of items is shown |
|  Nominal Scenario | The actor wants to check all the items in the System. |

##### Scenario 14.1 

| Scenario 14.1 | List items |
| ------------- |:-------------:| 
|  Precondition     | The actor (Warehouse Manager or OU) is logged in the System. |
|  Post condition     | The list of items is shown to the actor. |
| Step#        | Description  |
|  1     | The actor presses the button to see the list of all the items. |  
|  2     | The System shows the list of all items to the actor. |


### Use case 15, UC15 - Search an item

| Actors Involved | Warehouse Manager, OU, Warehouse Worker |
| ------------- |:-------------:|
|  Precondition     | The actor is logged in. |
|  Post condition 	| The item is shown to the actor. |
|  Nominal Scenario | The actor (Warehouse Manager or OU) searchs a specific item. Item's info is shown on GUI. |
|  Variants  		| Item does not exist, an error message is sent to the actor. |

##### Scenario 15.1 

| Scenario 15.1 | Search an existing item |
| ------------- |:-------------:| 
|  Precondition     | The actor (Warehouse Manager or OU) is logged in the System. |
|  Post condition     | The item is shown to the actor. |
| Step#        | Description  |
|  1     | The actor inserts the name of the item that he wants to search. |  
|  2     | The System checks if the item exists. |
|  3     | The System returns item's info to the actor. |

##### Scenario 15.2 

| Scenario 15.2 | Search an item that doesn't exist |
| ------------- |:-------------:| 
|  Precondition     | The actor (Warehouse Manager or OU) is logged in the System. |
|  Post condition     | An error message is shown to the actor. |
| Step#        | Description  |
|  1     | The actor inserts the name of the item that he wants to search. |  
|  2     | The System checks if the item exists. |
|  3     | The System returns an error message to the actor. |


### Use case 16, UC16 - Make an internal order

| Actors Involved        | OU Manager|
| ------------- |:-------------:| 
|  Precondition     | The OU Manager is authenticated |
|  Post condition     | An internal order is commited |
|  Nominal Scenario     | The OU Manager selects an item "I" that it wants to order. The OU Manager inserts the quantity. The order is sent.  |
|  Variants     | - |

##### Scenario 16.1

| Scenario 16.1 | Make an internal order |
| ------------- |:-------------:| 
|  Precondition     | The OU Manager is authenticated. |
|  Post condition     | An internal order is commited |
| Step#        | Description  |
|  1     | The actor selects the item they want to order.  |  
|  2     | The actor inserts the quantity. |
|  3     | The actor confirms the order. |


### Use case 17, UC17 - List internal orders
| Actors Involved        | Warehouse Manager |
| ------------- |:-------------:| 
| Precondition | Manager is logged in the system.|
| Post condition | Manager sees the the list of internal orders. |
| Nominal scenario | Manager navigate to the internal orders page. |
| Variants |  |

##### Scenario 17.1
| Scenario 17.1 | List of internal orders |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Manager wants to see the list of internal orders.  |
|  Post condition     | The list of internal orders is displayed |
| Step#        | Description  |  
|  1     | The Warehouse Manager navigates into the internal orders page |
|  2     | The System returns the list of all internal orders  |


### Use case 18, UC18 - Search internal orders
| Actors Involved        | Warehouse Manager |
| ------------- |:-------------:| 
| Precondition | Warehouse Manager is logged in the system. Manager is in the internal orders page.|
| Post condition | Warehouse Manager sees only the corresponding orders. |
| Nominal scenario | Warehouse Manager inserts the required informations. Manager confirms the operation. |
| Variants |  |

##### Scenario 18.1
| Scenario 18.1 | Search specific internal orders |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Manager wants to search specific internal orders.  |
|  Post condition     | The required internal orders are displayed |
| Step#        | Description  | 
|  1     | The Warehouse Manager navigate to the internal orders page |
|  2     | The System returns the list of all internal orders  |
|  3     | The Warehouse Manager inputs the search information |
|  4     | The Warehouse Manager confirms the search |
|  5     | The System returns the list of all internal orders which satisfy the informations  |


### Use case 19, UC19 - Submit internal order if items are available
| Actors Involved        | Warehouse Manager |
| ------------- |:-------------:| 
| Precondition | Warehouse Manager is logged in the system. The items in the order exist and are available.|
| Post condition | Warehouse Manager submits internal order. |
| Nominal scenario | Warehouse Manager is in the internal orders page. Warehouse Manager selects an internal order. Warehouse Manager confirms the operation. |
| Variants |  |


##### Scenario 19.1
| Scenario 19.1 | Items available for an internal order |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Warehouse Manager wants to submit an order. Items are available. |
|  Post condition     | Order is submitted by the Warehouse Manager |
| Step#        | Description  | 
|  1     | Warehouse Manager navigate in the internal orders page. |  
|  2     | The system displays the list of all placed internal orders. |
|  3     | Warehouse Manager selects one internal order |
|  4     | Warehouse Manager submits the order |
|  5     | The System informs the OU. |
|  6     | The System updates the item quantity and the warehouse available space. |

##### Scenario 19.2
| Scenario 19.2 | Items not available for an internal order |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Manager wants to submit an order. Items quantity is not enough. |
|  Post condition     | Order is not submitted |
| Step#        | Description  |
|  1     | Warehouse Manager navigates in the internal orders page |  
|  2     | The system display the list of all placed orders |
|  3     | Manager selects one order |
|  4     | Manager submits the order |
|  5     | The System returns an error because the quantity is not enough. |


### Use case 20, UC20 - Quality Moderator lists orders

| Actors Involved        | Quality Moderator |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. |
|  Post condition     | A list of order is shown |
|  Nominal Scenario     | The system shows a list of order. The Quality Moderator filters the orders |
|  Variants     | - |

##### Scenario 20.1

| Scenario 20.1 | List orders for Quality Moderator |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. |
|  Post condition     | a list of order is shown |
| Step#        | Description  |
|  1     | The actor inserts keywords to filter the orders.  |  
|  2     | The system shows a list of order. |


### Use case 21, UC21 - Test the item

| Actors Involved        | Quality Moderator |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. A list of order is shown |
|  Post condition     | Items are transfered into the warehouse |
|  Nominal Scenario     | The Quality Moderator selects an order. It inserts a description of the test it has done to the items. The item passes the test.  |
|  Variants     | The item does not pass the test.| 
|  Variants    | The item test is skipped |

##### Scenario 21.1

| Scenario 21.1 | Item passes the test |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. A list of order is shown |
|  Post condition     | The items are transfered into the warehouse. |
| Step#        | Description  |
|  1     | The actor selects an order from the list |  
|  2     | The actor inserts the quantity of item tested and a description of the test |
|  3     | The actor selects that the item passes the test.  |
|  4     | The system registers the items.  |

##### Scenario 21.2

| Scenario 21.2 | Item doesn't pass the test |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. A list of order is shown |
|  Post condition     | The items are sent back. |
| Step#        | Description  |
|  1     | The actor selects an order from the list |  
|  2     | The actor inserts the quantity of item tested and a description of the test |
|  3     | The actor selects that the item are rejected.  |
|  4     | The system doesn't register the items.  |

##### Scenario 21.3

| Scenario 21.3 | Item test is skipped |
| ------------- |:-------------:| 
|  Precondition     | The Quality Moderator is authenticated. A list of order is shown |
|  Post condition     | The items are transfered into the warehouse. |
| Step#        | Description  |
|  1     | The actor selects an order from the list |  
|  2     | The actor selects that the item skips the test.  |
|  3     | The system registers the items.  |


### Use case 22, UC22 - Update available space
| Actors Involved        | Manager |
| ------------- |:-------------:| 
| Precondition | Manager is logged in the system.|
| Post condition | Warehouse available space is updated. |
| Nominal scenario | Manager inserts the new/modified information. Manager confirms operation. |
| Variants |  |


##### Scenario 22.1

| Scenario 22.1 | Manager updates available space |
| ------------- |:-------------:| 
|  Precondition     | Manager is logged in the system. Manager wants to change available space.  |
|  Post condition     | Warehouse available space is updated |
| Step#        | Description  | 
|  1     | The Warehouse Manager navigates into the space management page |  
|  2     | The Warehouse Manager inserts informations he wants to change |
|  3     | The Warehouse Manager confirms the operation  |
|  4     | The System modifies the current value  |
|  5     | The resulting value is shown in the space management page |

##### Scenario 22.2

| Scenario 22.2 | Resulting available space is negative |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Manager wants to reduce available space. Resulting available space is negative  |
|  Post condition     | Warehouse available space is not updated |
| Step#        | Description  |
|  1     | The Warehouse Manager navigates into the space management page |  
|  2     | The Warehouse Manager inserts informations he wants to change |
|  3     | The Warehouse Manager confirms the operation  |
|  4     | The System returns an error  |
|  5     | The same value is shown in the space management page |

### Use case 23, UC23 - Check for available space
| Actors Involved        | Warehouse Manager |
| ------------- |:-------------:| 
| Precondition | Warehouse Manager is logged in the system.|
| Post condition | Warehouse available space is shown. |
| Nominal scenario | Warehouse Manager checks for available space in the warehouse. |
| Variants |  |

##### Scenario 23.1
| Scenario 23.1 | |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. Manager wants to see available space.  |
|  Post condition     | Warehouse available space is displayed |
| Step#        | Description  |
|  1     | The Warehouse Manager wants to check the available space in the warehouse. |
|  2     | The System returns the current available space.  |



### Use case 24, UC24 - Add new supplier

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to add doesn't already exist. |
|  Post condition 	| The supplier is added in the system |
|  Nominal Scenario | Manager adds a new supplier and populates its fields. |


##### Scenario 24.1

| Scenario 24.1 | New supplier is added|
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to add doesn't already exist. |
|  Post condition     | The supplier is added in the system. |
| Step#        | Description  |
|  1     | The Warehouse Manager inserts info for a new supplier to be added in the System. |
|  2     | The supplier is added into the System. |


### Use case 25, UC25 - Delete supplier

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to delete exists. |
|  Post condition 	| The supplier is deleted in the system. |
|  Nominal Scenario | Warehouse Manager deletes a supplier which is not needed anymore |


##### Scenario 25.1
| Scenario 25.1 | Supplier is deleted |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to delete exists. |
|  Post condition     | The supplier is deleted in the system. |
| Step#        | Description  |
|  1     | The Warehouse Manager presses the button to delete the supplier from the System. |
|  2     | The supplier is deleted from the System. |


### Use case 26, UC26 - Modify supplier's info

| Actors Involved | Warehouse Manager |
| ------------- |:-------------:|
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to update exists. |
|  Post condition 	| Supplier's info are modified |
|  Nominal Scenario | Warehouse Manager selects a supplier and modifies its info. |
|  Variants  		| |

##### Scenario 26.1
| Scenario 26.1 | Supplier's info are modified |
| ------------- |:-------------:| 
|  Precondition     | Warehouse Manager is logged in the system. The supplier he wants to update exists. |
|  Post condition     | The supplier's info are updated. |
| Step#        | Description  | 
|  1     | The Warehouse Manager selects a supplier to update its info. |
|  2     | The supplier is modified. |


# Glossary

![](assets/misc/Glossary.png)

# System Design
\<describe here system design>
Not really meaningful in this case.  Only software components are needed.
\<must be consistent with Context diagram>

# Deployment Diagram 

\<describe here deployment diagram >
![](assets/misc/DeploymentDiagram.png)







