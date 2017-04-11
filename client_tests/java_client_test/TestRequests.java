import java.util.*;
import org.json.*;

public class TestRequests{
    public MMSS_ServerCommander testClient;

    public TestRequests(String serverURL) throws Exception{
        testClient = new MMSS_ServerCommander(serverURL);
    }

    public void testGet(String url, Map<String,Object> params){
        System.out.println("Testing GET for: " + url);
        try{
            System.out.println(ServerRequest.get(url,params));
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testGetUser(){
        System.out.println("Testing getUser()");
        try{
            PassableUser user = testClient.getUser("12345abcde");
            System.out.println(user.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testListUsers(){
        System.out.println("Testing getUsers()");
        try{
            PassableUser[] users = testClient.getUsers();
            for(int i = 0; i < users.length; ++i){
                System.out.println("User " + (i+1) + ": " + users[i].toJSON());
            }
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testAddUser(){
        System.out.println("Testing addUser()");
        try{
            PassableUser tempUser = new PassableUser();
            tempUser.name = "TEST_REQUEST_USER";
            tempUser.id = "TEST_REQUEST_USER_ID";
            tempUser.type = "guardian";
            PassableResponse response = testClient.addUser(tempUser);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testEditUser(){
        System.out.println("Testing editUser()");
        try{
            PassableUser user = testClient.getUser("TEST_REQUEST_USER_ID");
            user.type = "dependent";
            user.isBeingListened = true;
            user.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.editUser(user);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testDeleteUser(){
        System.out.println("Testing deleteUser()");
        try{
            PassableUser user = testClient.getUser("TEST_REQUEST_USER_ID");
            user.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.deleteUser(user);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testGetModule(){
        System.out.println("Testing getModule()");
        try{
            PassableModule module = testClient.getModule("67890fghij");
            System.out.println(module.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testGetModules(){
        System.out.println("Testing getModules()");
        try{
            PassableModule[] modules = testClient.getModules();
            for(int i = 0; i < modules.length; ++i){
                System.out.println("Module " + (i+1) + ": " + modules[i].toJSON());
            }
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }    

    public void testAddModule(){
        System.out.println("Testing addModule()");
        try{
            PassableModule module = new PassableModule();
            module.name = "TEST_REQUEST_MODULE";
            module.id = "TEST_REQUEST_MODULE_ID";
            module.type = "sensormodule";
            PassableResponse response = testClient.addModule(module);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testEditModule(){
        System.out.println("Testing editModule()");
        try{
            PassableModule module = testClient.getModule("TEST_REQUEST_MODULE_ID");
            module.editorInfo = new PassableShortInfo("12345abcde", "user");
            module.isBeingListened = true;
            PassableResponse response = testClient.editModule(module);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testDeleteModule(){
        System.out.println("Testing deleteModule()");
        try{
            PassableModule module = testClient.getModule("TEST_REQUEST_MODULE_ID");
            module.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.deleteModule(module);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testModuleLog(){
        System.out.println("Testing addModuleLog()");
        try{
            PassableLog log = new PassableLog();
            log.authorInfo = new PassableShortInfo("TEST_REQUEST_MODULE_ID","module");
            log.message = "TEST_REQUEST_MODULE was triggered.";
            log.time = new ServerDate();
            log.subjectType = "module";
            PassableResponse response = testClient.addModuleLog(log);
            System.out.println(response.toJSON());
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testGetLogs(){
        System.out.println("Testing getLogs()");
        try{
            PassableLogRequest request = new PassableLogRequest();
            request.id = "12345abcde";
            request.start_time = new ServerDate("1970-01-01 00:00:00");
            PassableLog[] serverLogs = testClient.getLogs(request);
            for(int i = 0; i < serverLogs.length; ++i){
                System.out.println("Log " + (i+1) + ": " + serverLogs[i].toJSON());
            }
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public void testGetNotifications(){
        System.out.println("Testing getNotifications()");
        try{
            PassableUser user = testClient.getUser("12345abcde");
            PassableNotification[] notifications = testClient.getNotifications(user);
            for(int i = 0; i < notifications.length; ++i){
                System.out.println("Notif " + (i+1) + ": " + notifications[i].toJSON());
            }
            System.out.println("[SUCCESS]\n---\n");
        }catch(Exception e){
            System.out.println(e);
            System.out.println("[FAILURE]\n---\n");
        }
    }

    public static void main(String[] args){
        String serverURL = "http://127.0.0.1:8081";
        try{
            TestRequests tests = new TestRequests(serverURL);

            //list users
            tests.testListUsers();

            //get a user
            tests.testGetUser();

            //add a user
            tests.testAddUser();

            //edit a user
            tests.testEditUser();

            //delete a user
            tests.testDeleteUser();

            //get a module
            tests.testGetModule();

            //list modules
            tests.testGetModules();

            //add a module
            tests.testAddModule();

            //edit a module
            tests.testEditModule();

            //log a message
            tests.testModuleLog();

            //delete a module
            tests.testDeleteModule();

            //get logs
            tests.testGetLogs();

            //get notifications
            tests.testGetNotifications();
            
        }catch(Exception e){
            System.out.println(e);
        }

    }
}