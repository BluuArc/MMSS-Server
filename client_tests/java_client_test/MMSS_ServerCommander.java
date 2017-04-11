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

    private Map<String,Object> createPostData(String jsonObj) throws Exception{
        Map<String,Object> postData = new LinkedHashMap<>();
        postData.put("data",jsonObj);
        return postData;
    }

    private PassableResponse getPostResponse(String path, Map<String,Object> postData) throws Exception{
        String response = post(serverURL + path,postData);
        PassableResponse parsedResponse = new PassableResponse(response);
        return parsedResponse;
    }

    private PassableResponse getDeleteResponse(String path, Map<String,Object> postData)throws Exception{
        String response = delete(serverURL + path,postData);
        PassableResponse parsedResponse = new PassableResponse(response);
        return parsedResponse;
    }

    public PassableResponse addUser(PassableUser newUser)throws Exception{
        Map<String,Object> postData = createPostData(newUser.toJSON());

        return getPostResponse("/user/add", postData);
    }

    public PassableResponse editUser(PassableUser editedUser) throws Exception{
        Map<String,Object> postData = createPostData(editedUser.toJSON());
        return getPostResponse("/user/edit", postData);
    }

    public PassableResponse deleteUser(PassableUser userToDelete) throws Exception{
        Map<String,Object> postData = createPostData(userToDelete.toJSON());
        return getDeleteResponse("/user/remove", postData);
    }

    public PassableModule getModule(String id) throws Exception{
        PassableModule module = new PassableModule(get(serverURL + "/module/id/" + id));
        return module;
    }

    public PassableModule[] getModules() throws Exception{
        JSONArray jsonModules = new JSONArray(get(serverURL + "/module/list"));
        PassableModule[] modules = new PassableModule[jsonModules.length()];
        for(int i = 0; i < jsonModules.length(); ++i){
            JSONObject curObject = (JSONObject) jsonModules.get(i);
            modules[i] = new PassableModule(curObject.toString());
        }
        return modules;
    }

    public PassableResponse addModule(PassableModule newModule)throws Exception{
        Map<String,Object> postData = createPostData(newModule.toJSON());
        return getPostResponse("/module/add", postData);
    }

    public PassableResponse editModule(PassableModule editedModule) throws Exception{
        Map<String,Object> postData = createPostData(editedModule.toJSON());
        return getPostResponse("/module/edit", postData);
    }

    public PassableResponse deleteModule(PassableModule moduleToDelete) throws Exception{
        Map<String,Object> postData = createPostData(moduleToDelete.toJSON());
        return getDeleteResponse("/module/remove", postData);
    }
}