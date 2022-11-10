# Design Document 


Authors: Francesco Sorrentino, Lorenzo Gangemi, Andrea Aureli, Ma Yufei

Date: 27/04/2022

Version: 1.0

# Contents

- [High level design](#package-diagram)
- [Low level design](#class-diagram)
- [Verification traceability matrix](#verification-traceability-matrix)
- [Verification sequence diagrams](#verification-sequence-diagrams)

# Instructions

The design must satisfy the Official Requirements document, notably functional and non functional requirements, and be consistent with the APIs

# High level design 

<discuss architectural styles used, if any>
<report package diagram, if needed>

Using MVC architectural pattern.
The GUI package implement view part of MVC pattern.
The Data package implement model part of MVC pattern.
The exceptions package handles exceptions triggered by the user.
![](assets/design/HighLevelDesign.png) 





# Low level design

<for each package in high level design, report class diagram. Each class should detail attributes and operations>
![](assets/design/ClassDiagram.jpg) 








# Verification traceability matrix

\<for each functional requirement from the requirement document, list which classes concur to implement it>

|  |skucontroller|skuitemcontroller|testdescriptorcontroller|testresultcontroller|restockordercontroller|internalordercontroller|returnordercontroller|positioncontroller|itemcontroller|usercontroller|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|  FR1     |  |  |  |  |  |  |  |  |  | x |
| FR1.1    |  |  |  |  |  |  |  |  |  | x |
| FR1.2    |  |  |  |  |  |  |  |  |  | x |
| FR1.3    |  |  |  |  |  |  |  |  |  | x |
| FR1.4    |  |  |  |  |  |  |  |  |  | x |
| FR1.5    |  |  |  |  |  |  |  |  |  | x |
| FR2      | x |  |  |  |  |  |  |  |  |  |
| FR2.1    | x |  |  |  |  |  |  |  |  |  |
| FR2.2    | x |  |  |  |  |  |  |  |  |  |
| FR2.3    | x |  |  |  |  |  |  |  |  |  |
| FR2.4    | x |  |  |  |  |  |  |  |  |  |
| FR3      |  |  |  |  |  |  |  | x |  |  |
| FR3.1    |  |  |  |  |  |  |  | x |  |  |
| FR3.1.1  |  |  |  |  |  |  |  | x |  |  |
| FR3.1.2  |  |  |  |  |  |  |  | x |  |  |
| FR3.1.3  |  |  |  |  |  |  |  | x |  |  |
| FR3.1.4  |  |  |  |  |  |  |  | x |  |  |
| FR3.2    |  |  | x |  |  |  |  |  |  |  |
| FR3.2.1  |  |  | x |  |  |  |  |  |  |  |
| FR3.2.2  |  |  | x |  |  |  |  |  |  |  |
| FR3.2.3  |  |  | x |  |  |  |  |  |  |  |
| FR4      |  |  |  |  |  |  |  |  |  | x |
| FR4.1    |  |  |  |  |  |  |  |  |  | x |
| FR4.2    |  |  |  |  |  |  |  |  |  | x |
| FR4.3    |  |  |  |  |  |  |  |  |  | x |
| FR4.4    |  |  |  |  |  |  |  |  |  | x |
| FR5      |  |  |  |  | x |  |  |  |  |  |
| FR5.1    |  |  |  |  | x |  |  |  |  |  |
| FR5.2    | x |  |  |  | x |  |  |  |  |  |
| FR5.3    | x |  |  |  | x |  |  |  |  |  |
| FR5.4    | x |  |  |  | x |  |  |  |  |  |
| FR5.5    |  |  |  |  | x |  |  |  |  | x |
| FR5.6    |  |  |  |  | x |  |  |  |  |  |
| FR5.7    |  |  |  |  | x |  |  |  |  |  |
| FR5.8    |  |  |  |  | x |  |  |  |  |  |
| FR5.8.1  |  | x |  |  | x |  |  |  |  |  |
| FR5.8.2  |  | x |  |  |  |  |  |  |  |  |
| FR5.8.3  |  | x |  |  |  |  |  |  |  |  |
| FR5.9    |  | x |  |  |  |  | x |  |  |  |
| FR5.10   |  |  |  |  |  |  | x |  |  |  |
| FR5.11   |  |  |  |  |  |  | x |  |  |  |
| FR5.12   |  |  |  |  |  |  | x |  |  |  |
| FR6      |  |  |  |  |  | x |  |  |  |  |
| FR6.1    |  |  |  |  |  | x |  |  |  |  |
| FR6.2    | x |  |  |  |  | x |  |  |  |  |
| FR6.3    | x |  |  |  |  | x |  |  |  |  |
| FR6.4    | x |  |  |  |  | x |  |  |  |  |
| FR6.5    |  |  |  |  |  | x |  |  |  |  |
| FR6.6    |  |  |  |  |  | x |  |  |  |  |
| FR6.7    |  |  |  |  |  | x |  |  |  |  |
| FR6.8    |  |  |  |  |  | x |  |  |  |  |
| FR6.9    |  | x |  |  |  |  |  |  |  |  |
| FR6.10   |  | x |  |  |  |  |  |  |  |  |
| FR7      |  |  |  |  |  |  |  |  | ? |  |









# Verification sequence diagrams 
\<select key scenarios from the requirement document. For each of them define a sequence diagram showing that the scenario can be implemented by the classes and methods in the design>

### Scenario 1-2
![](assets/design/sequence%20diagram/1-2.jpg)
### Scenario 2-1
![](assets/design/sequence%20diagram/2-1.jpg)
### Scenario 3-2
![](assets/design/sequence%20diagram/3-2.PNG)
### Scenario 5-2-1
![](assets/design/sequence%20diagram/5-2-1.PNG)
### Scenario 6-1
![](assets/design/sequence%20diagram/6-1.png)
### Scenario 7-1
![](assets/design/sequence%20diagram/7-1.png)
 ### Scenario 9-2
![](assets/design/sequence%20diagram/9-2.png)