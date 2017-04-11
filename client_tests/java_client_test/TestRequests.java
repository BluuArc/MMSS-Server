import java.util.*;

public class TestRequests{
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

    public static void main(String[] args){
        String serverURL = "http://127.0.0.1:8081";
        TestRequests client = new TestRequests();
        
        client.testGet(serverURL + "/user/list",null);
    }
}