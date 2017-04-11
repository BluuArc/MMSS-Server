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
        try{
            PassableUser user = testClient.getUser("12345abcde");
            System.out.println(user.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testListUsers(){
        try{
            PassableUser[] users = testClient.getUsers();
            for(int i = 0; i < users.length; ++i){
                System.out.println((i+1) + ": " + users[i].toJSON());
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testAddUser(){
        try{
            PassableUser tempUser = new PassableUser();
            tempUser.name = "TEST_REQUEST_USER";
            tempUser.id = "TEST_REQUEST_USER_ID";
            tempUser.type = "guardian";
            PassableResponse response = testClient.addUser(tempUser);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testEditUser(){
        try{
            PassableUser user = testClient.getUser("TEST_REQUEST_USER_ID");
            user.type = "dependent";
            user.isBeingListened = true;
            user.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.editUser(user);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testDeleteUser(){
        try{
            PassableUser user = testClient.getUser("TEST_REQUEST_USER_ID");
            user.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.deleteUser(user);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testGetModule(){
        try{
            PassableModule module = testClient.getModule("67890fghij");
            System.out.println(module.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testGetModules(){
        try{
            PassableModule[] modules = testClient.getModules();
            for(int i = 0; i < modules.length; ++i){
                System.out.println((i+1) + ": " + modules[i].toJSON());
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }    

    public void testAddModule(){
        try{
            PassableModule module = new PassableModule();
            module.name = "TEST_REQUEST_MODULE";
            module.id = "TEST_REQUEST_MODULE_ID";
            module.type = "sensormodule";
            PassableResponse response = testClient.addModule(module);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testEditModule(){
        try{
            PassableModule module = testClient.getModule("TEST_REQUEST_MODULE_ID");
            module.editorInfo = new PassableShortInfo("12345abcde", "user");
            module.isBeingListened = true;
            PassableResponse response = testClient.editModule(module);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public void testDeleteModule(){
        try{
            PassableModule module = testClient.getModule("TEST_REQUEST_MODULE_ID");
            module.editorInfo = new PassableShortInfo("12345abcde", "user");
            PassableResponse response = testClient.deleteModule(module);
            System.out.println(response.toJSON());
        }catch(Exception e){
            System.out.println(e);
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

            //delete a module
            tests.testDeleteModule();
            
        }catch(Exception e){
            System.out.println(e);
        }

    }
}