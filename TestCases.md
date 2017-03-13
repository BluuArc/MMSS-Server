# Test Cases

## What is this?

This is a place where I keep track of the test cases used in this project.

---

## Test Case Template
* **Method Tested:** `/methodName`
* **Input:** input parameters for method
* **Output:** expected output for method based on input
* **Intended Action:** what the method is supposed to do
* **Notes:** The methods have slashes in front of them to indicate that we're testing a Node.JS server, instead of a Java program.

## Adding a Module
* **Method Tested:** `/addModule`
* **Input:** JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Specific ordering of the data isn't required as long as all the required data is in it.
``` 
{
    "isBeingListened":true,
    "mainServerID":"123.456.789:8080",
    "name":"front door sensor",
    "parameterData":[0],
    "id":"12345abcde",
    "type":"sensormodule"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of adding a module to the list. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Successfully added front door sensor (12345abcde) to the server"  
}
```
* **Intended Action:** Add a module to the current list of modules to listen to on the server.

## Removing a Module
* **Method Tested:** `/removeModule`
* **Input:** JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module.
``` 
{
    "id":"abcde12345",
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a module to the list. Default return value for valid input is shown below.
```
{
    "success":false,
    "message":"Failed to remove module with ID abcde12345 because it doesn't exist in the list."
}
```
* **Intended Action:** The method should remove the module from the list of modules to listen to on the server.

## Editing a Module
* **Method Tested:** `/editModule`
* **Input:** JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module and any changed data.
``` 
{
    "id":"abcde12345",
    "isBeingListened":true
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a module to the list. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Changed module with ID abcde12345. It is now being listened to"
}
```
* **Intended Action:** The method should edit some parameters of a module based on an input string.

## Listing All Modules
* **Method Tested:** `/listModules`
* **Input:** Simple connection to the `/listModules` URL via the GET protocol.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
{[
    {
        "isBeingListened":true,
        "mainServerID":"123.456.789:8080",
        "name":"front door sensor",
        "parameterData":[0],
        "id":"12345abcde",
        "type":"sensormodule"
    }
]}
 ```
* **Intended Action:** The method should list all the modules in all lists on the server.

## Listing All Modules of a Specific Type
* **Method Tested:** `/listModules/<type>`
* **Input:** Simple connection to the `/listModules/<type>` URL via the GET protocol. For example, this test will use `/listModules/sensormodule`.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
{[
    {
        "isBeingListened":true,
        "mainServerID":"123.456.789:8080",
        "name":"front door sensor",
        "parameterData":[0],
        "id":"12345abcde",
        "type":"sensormodule"
    }
]}
 ```
* **Intended Action:** The method should list all the modules of a given type, if any exist.