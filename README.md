# MMSS-Server
Server component for MMSS. Full project can be found [here](https://github.com/Walden1995/MMSS).

## Requirements
* A fairly recent version of Node.js installed (tested on v7.6.0)
* A properly configured network set up (if the server is to be accessed from an outside network)

## What's in here?
| Path | Description |
| --- | --- |
| `client_tests` | contains an old Node.js test client and a Java Test client |
| `client_tests/java_client_test` | contains the files for the Java Test client |
| `server-nodejs` | contains the files needed to run the server |

## How to Run the Server
1. Download the folder/repo onto your system.
2. Navigate to folder that contains the `server.js` file in a terminal window (have it point to the `server-node-js` folder).
3. Install the dependencies necessary with `npm install`
4. Start the server from the command line with `node server.js`
    * By default, the server listens to `127.0.0.1:80`. This can be changed by running the program with a `-p` or `--port` parameter for port and/or the `-i` or `--ip` parameter for address. For example, running it with `node server.js --port 8080 --ip 10.0.0.356` will allow it to run on 10.0.0.356:8080.
    * If you encounter an error, try again with `sudo node server.js`
        * This usually only occurs when you try to use one of the reserved ports (e.g. 80) for the server. Use this option if you're sure you've set up everything correctly and at your own risk.
    * If you want to be able to see live notifications and logs from the server, put the `--debug` flag at the end of the terminal command (e.g. `node server.js --debug`). 
        * You will be able to see new logs and notifications as they occur at the root of the server. (e.g. if the server is running at `127.0.0.1:8081`, you can go to that URL in your browser to see a small chat area that will be populated as new notifications and logs occur)
        * This also enables the use of the save command, which saves all the current data on the server (users, modules, logs, and notifications). You can access it by going to the `/save` URL; for example, if ther server is running at `127.0.0.1:8081` in debug mode, you can go to `127.0.0.1:8081/save` to trigger the saving of all the data. The data will be saved in the same place as the `server.js` file.
    * If you want to populate the server with demo users and modules, put the `--demo` flag at the end of the terminal command.
5. If you want to close the server, pressing CTRL-C on the terminal should do the trick.
   * Data may be lost as a result of this method, so be mindful of when you close.

## How to Run the Tests (Java)
1. Download the folder/repo onto your system.
2. Start the server at `127.0.0.1:8081` (default set up for TestRequests class) in debug mode as per the instructions above.
3. Navigate to `client_tests/java_client_tests` in a terminal window.
4. Compile the TestRequests class with `javac TestRequests.java`. The only warning you will probably see is something about some files performing some unsafe operations, but this is expected
    * This is due to the sample code in some of the Passable classes passing things into ArrayLists without type checking, but this is intended behavior since the server mostly handles the passing of data between modules and clients.
5. Run the TestRequests class with `java TestRequests`. If everything is set up correctly, the class will send a series of test requests to the server and print out the output. You should see a bunch of JSON strings in the output followed by `SUCCESS`. If any tests fail, refer to the output for more information.

## Dependencies
* See the `package.json` in `server-nodejs` for server dependencies and in `client_tests` for dependencies of the Node test client.
* The Java test client uses the `org.json` package to process JSON objects.