import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableUser implements Passable{
	public PassableShortInfo editorInfo;
	public String name;
	public String type;
	public String id;
	public ArrayList<PassableLog> logs;
	public ArrayList<PassableNotification> notifications;
	public boolean isBeingListened;
	public ServerDate lastUpdated;

	public PassableUser(){
		name = "";
		type = "";
		id = "";
		logs = new ArrayList<PassableLog>();
		notifications = new ArrayList<PassableNotification>();
		isBeingListened = false;
		lastUpdated = new ServerDate("1970-01-01 00:00:00");
		editorInfo = new PassableShortInfo("","");
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableUser(String input) throws Exception{
		PassableUser defaultUser = new PassableUser();
		JSONObject parsedInput = new JSONObject(input);
		id = (String) safelyGet(parsedInput, "id", defaultUser.id);
		if(id.equals("")){ //at the very minimum, ID must be valid
			throw new Exception("Error: Problem trying to get ID");
		}

		JSONObject editorJSON = (JSONObject) safelyGet(parsedInput,"editor_info", defaultUser.editorInfo.toJSONObject());
		try{
			editorInfo = new PassableShortInfo(editorJSON);
		}catch(Exception e){
			editorInfo = new PassableShortInfo("","");
		}

		name = (String) safelyGet(parsedInput, "name", defaultUser.name);
		type = (String) safelyGet(parsedInput, "type", defaultUser.type);
		isBeingListened = (boolean) safelyGet(parsedInput, "isBeingListened", defaultUser.isBeingListened);
		
		JSONArray logsInput = (JSONArray) safelyGet(parsedInput, "logs", defaultUser.logs);
		logs = new ArrayList<PassableLog>();
		for(int i = 0; i < logsInput.length(); ++i){
			JSONObject curObject = (JSONObject) logsInput.get(i);
			logs.add(new PassableLog(curObject));
		}

		JSONArray notificationsInput = (JSONArray) safelyGet(parsedInput, "notifications", defaultUser.notifications);
		notifications = new ArrayList<PassableNotification>();
		for(int i = 0; i < notificationsInput.length(); ++i){
			JSONObject curObject = (JSONObject) notificationsInput.get(i);
			notifications.add(new PassableNotification(curObject));
		}

		String date = (String) safelyGet(parsedInput, "last_update_time", "");
		if(date.length() > 0)
			lastUpdated = new ServerDate(date);
		else
			lastUpdated = new ServerDate();
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception {
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("editor_info", editorInfo.toJSONObject());
		returnJSONObj.put("name", name.toLowerCase());
		returnJSONObj.put("type", type.toLowerCase());
		returnJSONObj.put("id", id);

		JSONArray logsJSON = new JSONArray();
		for (int i = 0; i < logs.size(); ++i) {
			PassableLog curLog = (PassableLog) logs.get(i);
			logsJSON.put(curLog.toJSONObject());
		}
		returnJSONObj.put("logs", logsJSON);

		JSONArray notifsJSON = new JSONArray();
		for (int i = 0; i < notifications.size(); ++i) {
			PassableNotification curNotif = (PassableNotification) notifications.get(i);
			notifsJSON.put(curNotif.toJSONObject());
		}
		returnJSONObj.put("notifications", notifsJSON);

		returnJSONObj.put("isBeingListened", isBeingListened);
		returnJSONObj.put("last_update_time", lastUpdated.toString());
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
		PassableUser myUser = new PassableUser();
		myUser.name = "John Doe";
		myUser.type = "guardian";
		myUser.id = "12345abcde";

		PassableLog log1 = new PassableLog();
		// log1.id = "moduleid";
		log1.authorInfo = new PassableShortInfo("moduleid","module");
		myUser.logs.add(log1);

		PassableNotification note1 = new PassableNotification();
		note1.success = true;
		myUser.notifications.add(note1);
		try{
			System.out.println(myUser.toJSON());
			PassableUser myUser2 = new PassableUser(myUser.toJSON());
			myUser2.lastUpdated = new ServerDate();
			PassableLog log2 = new PassableLog();
			// log2.id = "moduleid2";
			log2.authorInfo = new PassableShortInfo("moduleid2", "module");
			log2.message = "A whole new log message";
			log2.time = new ServerDate();
			myUser2.logs.add(log2);

			PassableNotification note2 = new PassableNotification();
			note2.success = false;
			note2.time = new ServerDate();
			note2.message = "A whole new notification";
			myUser2.notifications.add(note2);

			myUser2.editorInfo = new PassableShortInfo("4dm1n","user");
			System.out.println(myUser2.toJSON());
		}catch(Exception e){
			System.out.println("ID '" + myUser.id + "' is invalid");
		}
			
	}
}
