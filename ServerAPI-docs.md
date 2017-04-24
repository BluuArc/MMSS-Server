# MMSS Server API Documentation

## How to Read This Documentation

This project is still in the very early stages of development as of April 24, 2017. As a result, it is possible for many parts of this documentation to drastically change as the project matures. Any TODOs you see means that there is something that isn't fully implemented and/or may be implemented at a later time.

## Notes

* Dates
    * Look at [this post](http://stackoverflow.com/questions/4216745/java-string-to-date-conversion/22180505#22180505) for info related to date parsing
    * Plan to use the following format: `yyyy-MM-dd kk:mm:ss`
        * One example time is `2017-03-26 14:00:00` for 2 PM on March 26, 2017.

---

## Test Case Template
* **Method Tested:** `/url/path/to/method`
* **Input:** input parameters for method
* **Output:** expected output for method based on input
* **Intended Action:** what the method is supposed to do
* **Notes:** The methods have slashes in front of them to indicate that we're testing a Node.JS server, instead of a Java program.

## Adding a Module
* **Method Tested:** `/module/add`
* **Input:** Accesssed via the POST protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Specific ordering of the data isn't required as long as all the required data is in it. The editor info is not required when adding a module, as it would be added to the server's blacklist automatically as soon as it's detected.
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "isBeingListened": false,
    "mainServerID": "123.456.789:8080",
    "name": "front door sensor",
    "parameterData": [0],
    "id": "s0m3m0dul3",
    "type": "sensormodule"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of adding a module to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Added front door sensor to the blacklist."
}
```
* **Intended Action:** Add a module to the current list of blacklisted modules on the server.

## Removing a Module
* **Method Tested:** `/module/remove`
* **Input:** Accessed via the DELETE protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module and editor info.
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "isBeingListened": false,
    "mainServerID": "123.456.789:8080",
    "name": "front door sensor",
    "parameterData": [0],
    "id": "s0m3m0dul3",
    "type": "sensormodule"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a module to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Removed Module with ID s0m3m0dul3 from the server."
}
```
* **Intended Action:** The method should remove the module from the list of modules on the server.

## Editing a Module
* **Method Tested:** `/module/edit`
* **Input:** Accessed via the POST protocol. JSON string of a module based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of module and any changed data. The only editable fields are the isBeingListened field and the name fields.
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "isBeingListened": true,
    "mainServerID": "123.456.789:8080",
    "name": "the sensor of the front door",
    "parameterData": [0],
    "id": "s0m3m0dul3",
    "type": "sensormodule"
}
```
* **Output:** Success or failure message (JSON) based on the success or failure of editing a module to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Module s0m3m0dul3 is now on the whitelist. Changed name of s0m3m0dul3 to be 'the sensor of the front door'. "
}
```
* **Intended Action:** The method should edit some parameters of a module based on an input string.

## Sending a Module Notification
* **Method Tested:** `/module/log`
* **Input:** Accessed via the POST protocol. JSON string of a module based on the [PassableLog](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. The time of the message must be in the following format: yyyy-mm-dd hh:mm:ss.
``` 
{
    "author_info": {
        "id": "s0m3m0dul3",
        "type": "module"
    },
    "data": [
        1
    ],
    "time": "2017-03-29 12:00:00",
    "message": "Front door sensor was triggered.",
    "subject_type": "module"
}
```
* **Output:** Success or failure message (JSON) based on the success or failure of logging the message. A sample return value for valid input is shown below.
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
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "front door sensor",
        "type": "sensormodule",
        "id": "12345abcde",
        "mainServerID": "127.0.0.1:8081",
        "parameterData": [
            0
        ],
        "isBeingListened": false
    },
    {
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "mainServerID": "127.0.0.1:8081",
        "name": "front door lights",
        "parameterData": [
            1
        ],
        "id": "67890fghij",
        "type": "interactivemodule",
        "isBeingListened": true
    },
    {
        "editor_info": {
            "id": "12345abcde",
            "type": "user"
        },
        "isBeingListened": false,
        "mainServerID": "127.0.0.1:8081",
        "name": "front door sensor",
        "parameterData": [
            0
        ],
        "id": "s0m3m0dul3",
        "type": "sensormodule"
    }
]
 ```
* **Intended Action:** The method should list all the modules on the server.

## Listing All Blacklisted Modules
* **Method Tested:** `/module/list/blacklist`
* **Input:** Simple connection to the `/module/list/blacklist` URL via the GET protocol.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "front door sensor",
        "type": "sensormodule",
        "id": "12345abcde",
        "mainServerID": "127.0.0.1:8081",
        "parameterData": [
            0
        ],
        "isBeingListened": false
    }
]
 ```
* **Intended Action:** The method should list all the blacklisted modules (i.e. where isBeingListened = false), if any exist.

## Listing All Blacklisted Modules of a Specific Type
* **Method Tested:** `/module/list/blacklist/<type>`
* **Input:** Simple connection to the `/module/list/blacklist/<type>` URL via the GET protocol. For example, this test will use `/module/list/blacklist/sensormodule`.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Default return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "front door sensor",
        "type": "sensormodule",
        "id": "12345abcde",
        "mainServerID": "127.0.0.1:8081",
        "parameterData": [
            0
        ],
        "isBeingListened": false
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
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "mainServerID": "127.0.0.1:8081",
        "name": "front door lights",
        "parameterData": [
            1
        ],
        "id": "67890fghij",
        "type": "interactivemodule",
        "isBeingListened": true
    },
    {
        "editor_info": {
            "id": "12345abcde",
            "type": "user"
        },
        "isBeingListened": true,
        "mainServerID": "127.0.0.1:8081",
        "name": "the sensor of the front door",
        "parameterData": [
            0
        ],
        "id": "s0m3m0dul3",
        "type": "sensormodule"
    }
]
```
* **Intended Action:** The method should list all the whitelisted modules, if any exist.

## Listing All Whitelisted Modules of a Specific Type
* **Method Tested:** `/module/list/whitelist/<type>`
* **Input:** Simple connection to the `/module/list/whitelist/<type>` URL via the GET protocol. For example, this test will use `/module/list/whitelist/interactivemodule`.
* **Output:** JSON string with array of modules, with the format of each module being based on the [PassableModule](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no modules are available.
``` 
[
    {
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "mainServerID": "127.0.0.1:8081",
        "name": "front door lights",
        "parameterData": [
            1
        ],
        "id": "67890fghij",
        "type": "interactivemodule",
        "isBeingListened": true
    }
]
```
* **Intended Action:** The method should list all the modules of a given type, if any exist.

## Adding a User
* **Method Tested:** `/user/add`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Specific ordering of the data isn't required as long as all the required data is in it.
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "name": "john doe",
    "id": "s0m3us3r",
    "type": "guardian",
    "logs": [],
    "notifications": [],
    "isBeingListened": false,
    "last_update_time": "2017-03-25 12:34:56"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of adding a user to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Added john doe to the blacklist."
}
```
* **Intended Action:** Add a user to the current list of users to listen to on the server.

## Removing a User
* **Method Tested:** `/user/remove`
* **Input:** Accessed via the DELETE protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user and editor info.
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "name": "john doe",
    "id": "s0m3us3r",
    "type": "guardian",
    "logs": [],
    "notifications": [],
    "isBeingListened": false,
    "last_update_time": "2017-03-25 12:34:56"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a user to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Removed User ID s0m3us3r from the server."
}
```
* **Intended Action:** The method should remove the user from the list of users to listen to on the server.

## Editing a User
* **Method Tested:** `/user/edit`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user, editor info, and any changed data. The only editable fields are name, type, and isBeingListened
``` 
{
    "editor_info": {
        "id": "12345abcde",
        "type": "user"
    },
    "name": "A brand new name",
    "id": "s0m3us3r",
    "type": "dependent",
    "logs": [],
    "notifications": [],
    "isBeingListened": true,
    "last_update_time": "2017-03-25 12:34:56"
}
 ```
* **Output:** Success or failure message (JSON) based on the success or failure of removing a user to the list. A sample return value for valid input is shown below.
```
{
    "success": true,
    "message": "Changed name of s0m3us3r to be 'A brand new name'. Changed the type of s0m3us3r to be dependent. User s0m3us3r is now on the whitelist. "
}
```
* **Intended Action:** The method should edit some parameters of a user based on an input string.

## Listing All Users
* **Method Tested:** `/user/list`
* **Input:** Simple connection to the `/user/list` URL via the GET protocol.
* **Output:** JSON string with array of users, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "name": "john doe",
        "id": "12345abcde",
        "type": "guardian",
        "logs": [],
        "notifications": [],
        "isBeingListened": true,
        "last_update_time": "2017-04-03 07:22:25"
    },
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [],
        "notifications": [],
        "isBeingListened": false,
        "last_update_time": "2017-03-20 12:34:56"
    },
    {
        "editor_info": {
            "id": "12345abcde",
            "type": "user"
        },
        "name": "A brand new name",
        "id": "s0m3us3r",
        "type": "dependent",
        "logs": [],
        "notifications": [],
        "isBeingListened": true,
        "last_update_time": "2017-03-25 12:34:56"
    }
]
 ```
* **Intended Action:** The method should list all the users in all lists on the server.

## Listing All Blacklisted Users
* **Method Tested:** `/user/list/blacklist`
* **Input:** Simple connection to the `/user/list/blacklist` URL via the GET protocol.
* **Output:** JSON string with array of users on the blacklist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [],
        "notifications": [],
        "isBeingListened": false,
        "last_update_time": "2017-03-20 12:34:56"
    }
]
 ```

## Listing All Blacklisted Users of a Specific Type
* **Method Tested:** `/user/list/blacklist/<type>`
* **Input:** Simple connection to the `/user/list/blacklist/<type>` URL via the GET protocol. For example, this test will use `/user/list/blacklist/dependent`.
* **Output:** JSON string with array of users on the blacklist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "editor_info": {
            "id": "4dminu53r",
            "type": "user"
        },
        "name": "billy bob",
        "id": "67890fghij",
        "type": "dependent",
        "logs": [],
        "notifications": [],
        "isBeingListened": false,
        "last_update_time": "2017-03-20 12:34:56"
    }
]
 ```

## Listing All Whitelisted Users
* **Method Tested:** `/user/list/whitelist`
* **Input:** Simple connection to the `/user/list/whitelist` URL via the GET protocol.
* **Output:** JSON string with array of users on the whitelist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "name": "john doe",
        "id": "12345abcde",
        "type": "guardian",
        "logs": [],
        "notifications": [],
        "isBeingListened": true,
        "last_update_time": "2017-04-03 07:22:25"
    },
    {
        "editor_info": {
            "id": "12345abcde",
            "type": "user"
        },
        "name": "A brand new name",
        "id": "s0m3us3r",
        "type": "dependent",
        "logs": [],
        "notifications": [],
        "isBeingListened": true,
        "last_update_time": "2017-03-25 12:34:56"
    }
]
 ```

 ## Listing All Whitelisted Users of a Specific Type
* **Method Tested:** `/user/list/whitelist/<type>`
* **Input:** Simple connection to the `/user/list/whitelist/<type>` URL via the GET protocol. For example, this test will use `/user/list/whitelist/guardian`.
* **Output:** JSON string with array of users on the whitelist, with the format of each user being based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no users are available.
``` 
[
    {
        "editor_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "name": "john doe",
        "id": "12345abcde",
        "type": "guardian",
        "logs": [],
        "notifications": [],
        "isBeingListened": true,
        "last_update_time": "2017-04-03 07:22:25"
    }
]
 ```

* **Intended Action:** The method should list all the users of a given type, if any exist.

## Requesting Logs
* **Method Tested:** `/logs`
* **Input:** Accessed via the GET protocol. JSON string of a user based on the [PassableLogRequest](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user, a start date, and an end date.
``` 
{
    "id": "12345abcde",
    "start_time": "2017-03-01 00:00:00",
    "end_time": "2017-04-03 07:51:14"
}
 ```
* **Output:** JSON string of with array of log objects based on the [PassableLog](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below. Array will be empty if no logs are available.
``` 
[
    {
        "author_info": {
            "id": "127.0.0.1:8081",
            "type": "server"
        },
        "message": "Added john doe to the blacklist.",
        "time": "2017-04-03 07:51:11",
        "subject_type": "user",
        "data": [
            {
                "type": "user",
                "id": "12345abcde"
            }
        ]
    },
    {
        "author_info": {
            "id": "127.0.0.1:8081",
            "type": "server"
        },
        "message": "Added billy bob to the blacklist.",
        "time": "2017-04-03 07:51:11",
        "subject_type": "user",
        "data": [
            {
                "type": "user",
                "id": "67890fghij"
            }
        ]
    },
    {
        "author_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "message": "No changed values were detected.",
        "time": "2017-04-03 07:51:11",
        "subject_type": "user",
        "data": [
            {
                "type": "user",
                "id": "12345abcde"
            }
        ]
    },
    {
        "author_info": {
            "id": "127.0.0.1:8081",
            "type": "server"
        },
        "message": "Added front door sensor to the blacklist.",
        "time": "2017-04-03 07:51:11",
        "subject_type": "module",
        "data": [
            {
                "type": "module",
                "id": "12345abcde"
            }
        ]
    },
    {
        "author_info": {
            "id": "127.0.0.1:8081",
            "type": "server"
        },
        "message": "Added front door lights to the blacklist.",
        "time": "2017-04-03 07:51:11",
        "subject_type": "module",
        "data": [
            {
                "type": "module",
                "id": "67890fghij"
            }
        ]
    },
    {
        "author_info": {
            "id": "l33tgu4rd1an",
            "type": "user"
        },
        "message": "Module 67890fghij is now on the whitelist. ",
        "time": "2017-04-03 07:51:11",
        "subject_type": "module",
        "data": [
            {
                "type": "module",
                "id": "67890fghij"
            }
        ]
    }
]
 ```
* **Intended Action:** The method should return the log data of a given user.

## Requesting Notifications
* **Method Tested:** `/notifications`
* **Input:** Accessed via the POST protocol. JSON string of a user based on the [PassableUser](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. Minimum needed is ID of user and the time of the last notification.
``` 
{
    "id":"12345abcde"
    "last_update_time": "2017-03-01 00:00:00"
}
 ```
* **Output:** JSON string of the requested user with the format being based on the [PassableNotification](https://github.com/Walden1995/MMSS/tree/master/api/Passable) API. A sample return value for valid input is shown below.
```
[
    {
        "success": true,
        "message": "Added john doe to the blacklist.",
        "time": "2017-04-03 07:04:24",
        "data": [
            {
                "type": "user",
                "id": "12345abcde"
            }
        ]
    },
    {
        "success": true,
        "message": "Added billy bob to the blacklist.",
        "time": "2017-04-03 07:04:24",
        "data": [
            {
                "type": "user",
                "id": "67890fghij"
            }
        ]
    },
    {
        "success": true,
        "message": "Added front door sensor to the blacklist.",
        "time": "2017-04-03 07:04:24",
        "data": [
            {
                "type": "module",
                "id": "12345abcde"
            }
        ]
    },
    {
        "success": true,
        "message": "Added front door lights to the blacklist.",
        "time": "2017-04-03 07:04:24",
        "data": [
            {
                "type": "module",
                "id": "67890fghij"
            }
        ]
    },
    {
        "success": true,
        "message": "Module 67890fghij is now on the whitelist. ",
        "time": "2017-04-03 07:04:24",
        "data": [
            {
                "type": "module",
                "id": "67890fghij"
            }
        ]
    },
    {
        "success": true,
        "message": "Added front door sensor to the blacklist.",
        "time": "2017-04-03 07:05:05",
        "data": [
            {
                "type": "module",
                "id": "s0m3m0dul3"
            }
        ]
    },
    {
        "success": true,
        "message": "Module s0m3m0dul3 is now on the whitelist. Changed name of s0m3m0dul3 to be 'the sensor of the front door'. ",
        "time": "2017-04-03 07:05:50",
        "data": [
            {
                "type": "module",
                "id": "s0m3m0dul3"
            }
        ]
    },
    {
        "success": true,
        "message": "Deleted the sensor of the front door from the server.",
        "time": "2017-04-03 07:06:02",
        "data": [
            {
                "type": "module",
                "id": "s0m3m0dul3"
            }
        ]
    },
    {
        "success": true,
        "message": "Added john doe to the blacklist.",
        "time": "2017-04-03 07:06:42",
        "data": [
            {
                "type": "user",
                "id": "s0m3us3r"
            }
        ]
    },
    {
        "success": true,
        "message": "Changed name of s0m3us3r to be 'A brand new name'. Changed the type of s0m3us3r to be dependent. User s0m3us3r is now on the whitelist. ",
        "time": "2017-04-03 07:06:45",
        "data": [
            {
                "type": "user",
                "id": "s0m3us3r"
            }
        ]
    },
    {
        "success": true,
        "message": "Deleted A brand new name from the server.",
        "time": "2017-04-03 07:07:03",
        "data": [
            {
                "type": "user",
                "id": "s0m3us3r"
            }
        ]
    },
    {
        "success": true,
        "message": "Front door sensor was triggered.",
        "time": "2017-04-03 07:07:43",
        "data": [
            {
                "type": "none"
            }
        ]
    }
]
```
* **Intended Action:** The method should return the notification data.
