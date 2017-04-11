import java.util.*;
import org.json.*;

public class MMSS_ServerCommander extends ServerRequest{
    private String serverURL;

    public MMSS_ServerCommander(String inputURL) throws Exception{
        setServerURL(inputURL);
    }

    public void setServerURL(String inputURL) throws Exception{
        if(inputURL.indexOf("http") == 0 && inputURL.lastIndexOf("/") != (inputURL.length() - 1)){
            serverURL = inputURL;
        }else{
            throw new Exception("URL must contain http at the beginning and not a / at the end");
        }
    }

    public PassableUser getUser(String id) throws Exception{
        PassableUser user = new PassableUser(get(serverURL + "/user/id/" + id));
        return user;
    }

    public PassableUser[] getUsers() throws Exception{
        JSONArray jsonUsers = new JSONArray(get(serverURL + "/user/list"));
        PassableUser[] users = new PassableUser[jsonUsers.length()];
        for(int i = 0; i < jsonUsers.length(); ++i){
            JSONObject curObject = (JSONObject) jsonUsers.get(i);
            users[i] = new PassableUser(curObject.toString());
        }
        return users;
    }

    public PassableResponse addUser(PassableUser newUser)throws Exception{
        Map<String,Object> postData = new LinkedHashMap<>();
        postData.put("data",newUser.toJSON());

        String response = post(serverURL + "/user/add",postData);
        PassableResponse parsedResponse = new PassableResponse(response);
        return parsedResponse;
    }

    public PassableResponse editUser(PassableUser editedUser) throws Exception{
        Map<String,Object> postData = new LinkedHashMap<>();
        postData.put("data", editedUser.toJSON());

        String response = post(serverURL + "/user/edit", postData);
        PassableResponse parsedResponse = new PassableResponse(response);
        return parsedResponse;
    }

    public PassableResponse deleteUser(PassableUser userToDelete) throws Exception{
        Map<String,Object> postData = new LinkedHashMap<>();
        postData.put("data", userToDelete.toJSON());
        String response = delete(serverURL + "/user/remove", postData);
        PassableResponse parsedResponse = new PassableResponse(response);
        return parsedResponse;
    }
}