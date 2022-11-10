# Project Estimation  

Authors: Francesco Sorrentino, Lorenzo Gangemi, Andrea Aureli, Ma Yufei

Date: 12/04/2022

Version: 1.0


# Estimation approach
In this section, we have utilized waterfall approach in order to do an estimation of the effort needed for the project.


# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |        30                     |             
| A = Estimated average size per class, in LOC       |          250                  | 
| S = Estimated size of project, in LOC (= NC * A) | 7500 |   
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |            750                        |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 22500 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |         4.69          |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|requirement document    | 45 |
| GUI prototype | 15 |
|design document | 40 |
|code | 200 |
| unit tests | 80 |
| api tests | 40 |
| management documents  | 40 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|  Requirements | |
|  Elicitation | 7 |
|  Model process | 6 |
|  Progress estimation + planning | 6 |
|  Define high level use cases | 5 |
|  Software requirements document formalization | 18 |
|  Requirements inspection (V & V) | 10 |
|  Design GUI | 15 |
|  Design | |
|  Analysis | 4 |
|  High level document formalization | 7 |
|  Low level document formalization | 16 |
|  Design inspection (V & V) | 10 |
|  Units Code Implementation ||
|  Implement code units | 200 |
|  Units Testing | |
|  Tests implementation following use cases | 70 |
|  Tests inspection (V & V) | 10 |
|  Test code units (V & V) | 25 |
|  API Testing |  |
|  Test modules as a group | 20 |
|  Test the program with integrations | 20 |
|  Management |  |
|  Project management  | 10 |
|  Configuration management  | 10 |
|  Project documentation | 10 |
###

![](assets/misc/Gannt.png) 

# Summary

The last 2 estimation methods don't differ that much, but going into details we can see how the estimation of the time decreases.
The first one estimation is much bigger than the other two: that's because of the assumption of 10 LOC / 1 ph; in reality a group of four people could write more than 50 LOC per hour each, so in the "estimate by size" we ha a strong overestimation.

|             | Estimated effort                        |   Estimated duration |          
| ----------- | ------------------------------- | ---------------|
| estimate by size | 750 | 4.69 w |
| estimate by product decomposition | 510 | 3.19 w |
| estimate by activity decomposition | 479 | 2.99 w |






