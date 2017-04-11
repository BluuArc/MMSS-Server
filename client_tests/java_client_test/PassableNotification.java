import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableNotification implements Passable{
	public boolean success;
	public String message;
	public ServerDate time;
	public ArrayList<PassableShortInfo> data;

	public PassableNotification(){
		success = false;
		message = "No message received or invalid response from server";
		time = new ServerDate("1970-01-01 00:00:00");
		data = new ArrayList<PassableShortInfo>();
	}

	//input is a JSON Object as a string
	public PassableNotification(String input) throws Exception{
		this(new JSONObject(input));
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableNotification(JSONObject parsedInput) throws Exception{
		PassableNotification defaultNotification = new PassableNotification();
		// JSONObject parsedInput = new JSONObject(input);
		success = (boolean) safelyGet(parsedInput, "success", defaultNotification.success);
		if(success != true && success != false){//shouldn't happen
			throw new Exception("Error: Problem trying to get success boolean");
		}

		String date = (String) safelyGet(parsedInput, "time", "");
		if(date.length() > 0)
			time = new ServerDate(date);
		else
			throw new Exception("Error: Problem trying to get time data");

		message = (String) safelyGet(parsedInput, "message", defaultNotification.message);
		JSONArray dataArray = (JSONArray) safelyGet(parsedInput, "data", defaultNotification.data);
		data = new ArrayList<PassableShortInfo>();
		for(int i = 0; i < dataArray.length(); ++i){
			JSONObject curObject = (JSONObject) dataArray.get(i);
			data.add(new PassableShortInfo(curObject));
		}
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public String toJSON() throws Exception{
		return toJSONObject().toString();
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception{
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("success", success);
		returnJSONObj.put("message", message);
		returnJSONObj.put("time", time);
		JSONArray tempArray = new JSONArray();
		for(int i = 0; i < data.size(); ++i){
			PassableShortInfo curPage = (PassableShortInfo) data.get(i);
			tempArray.put(curPage.toJSONObject());
		}
		returnJSONObj.put("data",tempArray);
		return returnJSONObj;
	}

	public boolean isBeingListened(){
		return true;
	}

	// example usage
	public static void main(String[] args) {
		PassableNotification myResponse = new PassableNotification();
		myResponse.data.add(new PassableShortInfo("myID", "myType"));
		try{
			System.out.println(myResponse.toJSON());
			PassableNotification myResponse2 = new PassableNotification(myResponse.toJSON());
			myResponse2.success = true;
			myResponse2.message = "A whole new message";
			myResponse2.data.add(new PassableShortInfo("newID", "newType"));
			myResponse2.time = new ServerDate();
			System.out.println(myResponse2.toJSON());
		}catch(Exception e){
			System.out.println(e);
			System.out.println("Response is invalid");
		}
			
	}
}
