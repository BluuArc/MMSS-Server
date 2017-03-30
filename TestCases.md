# Test Cases

## What is this?

This is a place where I keep track of the test cases used in this project.

## Notes

* TODO
    * add a more uniform notification API (which includes time of notification and contents of notification (type and id?))
        * Array for data for possibility of multiple links
        * Info necessary to create a notification?
        * Possible example notification
```
{
    "success":true,
    "message":"Successfully added 'front door sensor (12345abcde)' to the server",
    "time": "2017-03-26 15:53:32"
    "data":[
        {
            "type":"module",
            "id":"12345abcde"
        }
    ]
}
```
* Dates
    * Look at [this post](http://stackoverflow.com/questions/4216745/java-string-to-date-conversion/22180505#22180505) for info related to date parsing
    * Plan to use the following format: `yyyy-MM-dd kk:mm:ss`
        * One example time is `2017-03-26 14:00:00` for 2 PM on March 26, 2017.

---

## Test Case Template
* **Method Tested:** `/methodName`
* **Input:** input parameters for method
* **Output:** expected output for method based on input
* **Intended Action:** what the method is supposed to do
* **Notes:** The methods have slashes in front of them to indicate that we're testing a Node.JS server, instead of a Java program.

## Adding a Module
* **Method Tested:** `/module/add`
* **Input:** Accesssed via the POST protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Specific ordering of the data isn't required as long as all the required data is in it.
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
    "message":"Successfully added 'front door sensor (12345abcde)' to the server"
}
```
* **Intended Action:** Add a module to the current list of modules to listen to on the server.

## Removing a Module
* **Method Tested:** `/module/remove`
* **Input:** Accessed via the DELETE protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module.
``` 
{
    "id":"abcde12345"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a module to the list. Default return value for valid input is shown below.
```
{
    "success":false,
    "message":"Failed to remove module with ID 'abcde12345' because it doesn't exist in the list."
}
```
* **Intended Action:** The method should remove the module from the list of modules to listen to on the server.

## Editing a Module
* **Method Tested:** `/module/edit`
* **Input:** Accessed via the POST protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module and any changed data. A message field is necessary if a message is to be passed as well.
``` 
{
    "id":"abcde12345",
    "isBeingListened":true
}
```
* **Output:** Success or failure message (JSON) based on the success or failure of editing a module to the list. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Changed module with ID 'abcde12345'. It is now being listened to"
}
```
* **Intended Action:** The method should edit some parameters of a module based on an input string.

## Sending a Module Notification
* **Method Tested:** `/module/log`
* **Input:** Accessed via the POST protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module, the parameterList, the message, the module type, and the time of the message in the following format: yyyy-mm-dd hh:mm:ss
``` 
{
    "id":"abcde12345",
    "parameterData":[0],
    "message": "Front door sensor was triggered",
    "time": "2017-03-26 15:53:32",
    "type": "sensormodule"
}
```
* **Output:** Success or failure message (JSON) based on the success or failure of logging the message. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Successfully logged message."
}
```
* **Intended Action:** The method should edit some parameters of a module based on an input string.

## Listing All Modules
* **Method Tested:** `/module/list`
* **Input:** Simple connection to the `/module/list` URL via the GET protocol.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "isBeingListened":true,
        "mainServerID":"123.456.789:8080",
        "name":"front door sensor",
        "parameterData":[0],
        "id":"12345abcde",
        "type":"sensormodule"
    }
]
 ```
* **Intended Action:** The method should list all the modules in all lists on the server.

## Listing All Blacklisted Modules
* **Method Tested:** `/module/list/blacklist`
* **Input:** Simple connection to the `/module/list/blacklist` URL via the GET protocol.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "isBeingListened":false,
        "mainServerID":"123.456.789:8080",
        "name":"rear door sensor",
        "parameterData":[0],
        "id":"67890fghij",
        "type":"sensormodule"
    }
]
 ```
* **Intended Action:** The method should list all the blacklisted modules, if any exist.

## Listing All Blacklisted Modules of a Specific Type
* **Method Tested:** `/module/list/blacklist/<type>`
* **Input:** Simple connection to the `/module/list/blacklist/<type>` URL via the GET protocol. For example, this test will use `/module/list/blacklist/sensormodule`.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "isBeingListened":false,
        "mainServerID":"123.456.789:8080",
        "name":"rear door sensor",
        "parameterData":[0],
        "id":"67890fghij",
        "type":"sensormodule"
    }
]
 ```
* **Intended Action:** The method should list all the modules of a given type, if any exist.

## Listing All Whitelisted Modules
* **Method Tested:** `/module/list/whitelist`
* **Input:** Simple connection to the `/module/list/whitelist` URL via the GET protocol.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "isBeingListened":true,
        "mainServerID":"123.456.789:8080",
        "name":"front door sensor",
        "parameterData":[0],
        "id":"12345abcde",
        "type":"sensormodule"
    }
]
```
* **Intended Action:** The method should list all the whitelisted modules, if any exist.

## Listing All Whitelisted Modules of a Specific Type
* **Method Tested:** `/module/list/whitelist/<type>`
* **Input:** Simple connection to the `/module/list/whitelist/<type>` URL via the GET protocol. For example, this test will use `/module/list/whitelist/sensormodule`.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "isBeingListened":true,
        "mainServerID":"123.456.789:8080",
        "name":"front door sensor",
        "parameterData":[0],
        "id":"12345abcde",
        "type":"sensormodule"
    }
]
```
* **Intended Action:** The method should list all the modules of a given type, if any exist.

## Adding a User
* **Method Tested:** `/user/add`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Specific ordering of the data isn't required as long as all the required data is in it.
``` 
{
    "isBeingListened":false,
    "name":"john doe",
    "id":"12345abcde",
    "type":"guardian",
    "logs":[],
    "notifications":[]
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of adding a user to the list. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Successfully added 'john doe' (12345abcde) to the server"  
}
```
* **Intended Action:** Add a user to the current list of users to listen to on the server.

## Removing a User
* **Method Tested:** `/user/remove`
* **Input:** Accessed via the DELETE protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user.
``` 
{
    "id":"abcde12345"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a user to the list. Default return value for valid input is shown below.
```
{
    "success":false,
    "message":"Failed to remove user with ID 'abcde12345' because it doesn't exist in the list."
}
```
* **Intended Action:** The method should remove the user from the list of users to listen to on the server.

## Editing a User
* **Method Tested:** `/user/edit`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user and any changed data.
``` 
{
    "id":"abcde12345",
    "name":"john doe ii",
    "isBeingListened":true
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a user to the list. Default return value for valid input is shown below.
```
{
    "success":true,
    "message":"Changed user with ID 'abcde12345'. It is now being listened to. It is now named 'john doe ii'."
}
```
* **Intended Action:** The method should edit some parameters of a user based on an input string.

## Listing All Users
* **Method Tested:** `/user/list`
* **Input:** Simple connection to the `/user/list` URL via the GET protocol.
* **Output:** JSON string with array of users, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "isBeingListened":true,
        "name":"john doe",
        "id":"12345abcde",
        "type":"guardian",
        "logs":[],
        "notifications":[]
    }
]
 ```
* **Intended Action:** The method should list all the users in all lists on the server.

## Listing All Blacklisted Users
* **Method Tested:** `/user/list/blacklist`
* **Input:** Simple connection to the `/user/list/blacklist` URL via the GET protocol.
* **Output:** JSON string with array of users on the blacklist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "isBeingListened": false,
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [
            "log 1"
        ],
        "notifications": [
            "note 1"
        ]
    }
]
 ```

## Listing All Blacklisted Users of a Specific Type
* **Method Tested:** `/user/list/blacklist/<type>`
* **Input:** Simple connection to the `/user/list/blacklist/<type>` URL via the GET protocol. For example, this test will use `/user/list/blacklist/dependent`.
* **Output:** JSON string with array of users on the blacklist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "isBeingListened": false,
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [
            "log 1"
        ],
        "notifications": [
            "note 1"
        ]
    }
]
 ```

## Listing All Whitelisted Users
* **Method Tested:** `/user/list/whitelist`
* **Input:** Simple connection to the `/user/list/whitelist` URL via the GET protocol.
* **Output:** JSON string with array of users on the whitelist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "isBeingListened":true,
        "name":"john doe",
        "id":"12345abcde",
        "type":"guardian",
        "logs":[],
        "notifications":[]
    }
]
 ```

 ## Listing All Whitelisted Users of a Specific Type
* **Method Tested:** `/user/list/whitelist/<type>`
* **Input:** Simple connection to the `/user/list/whitelist/<type>` URL via the GET protocol. For example, this test will use `/user/list/whitelist/guardian`.
* **Output:** JSON string with array of users on the whitelist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "isBeingListened":true,
        "name":"john doe",
        "id":"12345abcde",
        "type":"guardian",
        "logs":[],
        "notifications":[]
    }
]
 ```

* **Intended Action:** The method should list all the users of a given type, if any exist.

## Requesting Logs
* **Method Tested:** `/logs`
* **Input:** Accessed via the GET protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user, a start date, and an end date.
``` 
{
    "id": "abcde12345",
    "start_time": "2017-03-01 00:00:00",
    "end_time": "2017-03-30 10:58:42"
}
 ```
* **Output:** JSON string of the requested user with the format being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. The notifications array will be empty.
``` 
{
    "isBeingListened":false,
    "name":"john doe",
    "id":"12345abcde",
    "type":"guardian",
    "logs":["dummy log entry 1"],
    "notifications":[]
}
 ```
* **Intended Action:** The method should return the log data of a given user.

## Requesting Notifications
* **Method Tested:** `/notifications`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user and the time of the last notification.
``` 
{
    "id":"abcde12345"
    "last_update_time": "< last_notification_time > (type / format?)"
}
 ```
* **Output:** JSON string of the requested user with the format being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. The logs array will be empty.
``` 
{
    "isBeingListened":false,
    "name":"john doe",
    "id":"12345abcde",
    "type":"guardian",
    "logs":[],
    "notifications":["dummy notification entry 1"]
}
 ```
* **Intended Action:** The method should return the notification data of a given user.