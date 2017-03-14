# MMSS Server API Documentation

## How to Read This Documentation

This project is still in the very early stages of development as of March 10, 2017. As a result, it is possible for many parts of this documentation to drastically change as the project matures. Any TODOs you see means that there is something that isn't fully implemented and/or will be implemented at a later time.

## How to Run

1. Download the folder/repo onto your system.
2. Navigate to folder that contains the `server.js` file in a terminal window.
3. Start the server from the command line with `node server.js`
   * By default, the server listens to `127.0.0.1:80`. This can be changed by running the program with a `-p` or `--port` parameter for port and/or the `-i` or `--ip` parameter for address. For example, running it with `node server.js --port 8080 --ip 10.0.0.356` will allow it to run on 10.0.0.356:8080.
   * If you encounter an error, try again with `sudo node server.js`
    * This usually only occurs when you try to use one of the reserved ports (e.g. 80) for the server. Use this option if you're sure you've set up everything correctly and at your own risk.
4. If you want to close the server, pressing CTRL-C on the terminal should do the trick.
   * Data may be lost as a result of this method, so be mindful of when you close.
   * TODO: Add a more graceful way of closing the server.

## Available API Calls

### Notes
* All of the API calls here appear right after your server URL, unless if stated otherwise. 
    * For example if your server URL is `mysite.com` and you want to use `someAPICall`, you would go to `mysite.com/someAPICall` on your client. 
* Anything with a pair of angle brackets works like a variable.
    * Ex: `<site>` for the server URL or some site, `<type>` for the type of something.

### listUsers
* **Description:** List all users that are currently subscribed to the server.
* **Usage:** `<site>/listUsers` via GET
* **Expected Output and Fields:** A JSON string that contains a list of users.
    * Name (string) - Name of the user
    * Type (string) - User type (e.g. guardian or dependent)
    * ID (string) - An ID unique to each user
    * Logs (Array) - Collection of logs of events of each user.
    * Notifications (Array) - Collection of notifications that have been sent to each user.

### listUsers/\<type>
* **Description:** Similar to `listUsers`, but instead of listing all users, it lists all users of a given type.
* **Usage:** `<site>/listUsers/<type>` via GET
* **Example Output and Fields:** A JSON string that contains a list of users.
    * see `listUsers` for the fields of the returned JSON string.
* **Example:** `<site>/listUsers/dependent` would return a JSON string of all the users of type `dependent`

### listModules
* **Description:** List all modules that are currently subscribed to the server.
* **Usage:** `<site>/listModules` via GET
* **Expected Output and Fields:** A JSON string that contains a list of modules.
    * Name (string) - Name of the module
    * Type (string) - User type (e.g. sensormodule or interactivemodule)
    * ID (string) - An ID unique to each module
    * mainServerID (string) - An ID relating to the server the module is subscribed to
    * parameterData (Array) - Array of objects related to the adjustable parameters of each module

### listModules/\<type>
* **Description:** Similar to `listModules`, but instead of listing all modules, it lists all modules of a given type.
* **Usage:** `<site>/listModules/<type>` via GET
* **Example Output and Fields:** A JSON string that contains a list of modules.
    * see `listModules` for the fields of the returned JSON string.
* **Example:** `<site>/listModules/sensormodule` would return a JSON string of all the modules of type `sensormodule`