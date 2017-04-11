import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableModule implements Passable{
	public PassableShortInfo editorInfo;
	public String name;
	public String type;
	public String id;
	public String mainServerID;
	public ArrayList parameterData;
	public boolean isBeingListened;

	public PassableModule(){
		name = "";
		type = "";
		id = "";
		mainServerID = "";
		parameterData = new ArrayList();
		isBeingListened = false;
		editorInfo = new PassableShortInfo("","");
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableModule(String input) throws Exception{
		PassableModule defaultModule = new PassableModule();
		JSONObject parsedInput = new JSONObject(input);
		id = (String) safelyGet(parsedInput, "id", defaultModule.id);
		if(id.equals("")){ //at the very minimum, ID must be valid
			throw new Exception("Error: Problem trying to get ID");
		}

		JSONObject editorJSON = (JSONObject) safelyGet(parsedInput,"editor_info", defaultModule.editorInfo.toJSONObject());
		try{
			editorInfo = new PassableShortInfo(editorJSON);
		}catch(Exception e){
			editorInfo = new PassableShortInfo("","");
		}

		name = (String) safelyGet(parsedInput, "name", defaultModule.name);
		type = (String) safelyGet(parsedInput, "type", defaultModule.type);
		isBeingListened = (boolean) safelyGet(parsedInput, "isBeingListened", defaultModule.isBeingListened);

		mainServerID = (String) safelyGet(parsedInput, "mainServerID", defaultModule.mainServerID);
		JSONArray parametersArray = (JSONArray) safelyGet(parsedInput, "parameterData", defaultModule.parameterData);
		parameterData = new ArrayList();
		for(int i = 0; i < parametersArray.length(); ++i){
			parameterData.add(parametersArray.get(i));
		}
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception {
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("editor_info", editorInfo.toJSONObject());
		returnJSONObj.put("name", name.toLowerCase());
		returnJSONObj.put("type", type.toLowerCase());
		returnJSONObj.put("id", id);
		returnJSONObj.put("mainServerID", mainServerID);
		returnJSONObj.put("parameterData", parameterData);
		returnJSONObj.put("isBeingListened", isBeingListened);
		return returnJSONObj;
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public String toJSON() throws Exception{
		return toJSONObject().toString();
	}

	public boolean isBeingListened(){
		return isBeingListened;
	}

	// example usage
	public static void main(String[] args) {
		PassableModule myModule = new PassableModule();
		myModule.name = "Front Door Sensor";
		myModule.type = "sensormodule";
		myModule.id = "12345abcde";
		myModule.mainServerID = "123.456.789:8080";
		myModule.parameterData.add(0);
		myModule.parameterData.add("test string");
		myModule.parameterData.add('c');
		myModule.parameterData.add(50);

		try{
			System.out.println(myModule.toJSON());
			PassableModule myModule2 = new PassableModule(myModule.toJSON());
			myModule2.editorInfo = new PassableShortInfo("4dm1n","user");
			myModule2.parameterData.add("a new value");
			System.out.println(myModule2.toJSON());
		}catch(Exception e){
			System.out.println("ID '" + myModule.id + "' is invalid");
		}
	}
}
