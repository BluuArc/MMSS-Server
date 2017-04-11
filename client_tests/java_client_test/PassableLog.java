import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableLog implements Passable{
	public PassableShortInfo authorInfo;
	public String message;
	public ServerDate time;
	public String subjectType;
	public ArrayList data;

	public PassableLog(){
		authorInfo = new PassableShortInfo("none","none");
		data = new ArrayList();
		time = new ServerDate("1970-01-01 00:00:00");
		message = "No log message was input into this field.";
		subjectType = "none";
	}

	//input is a JSON Object as a string
	public PassableLog(String input) throws Exception{
		this(new JSONObject(input));
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableLog(JSONObject parsedInput) throws Exception{
		PassableLog defaultLog = new PassableLog();
		JSONObject authorJSON = (JSONObject) safelyGet(parsedInput,"author_info", defaultLog.authorInfo.toJSONObject());
		try{
			authorInfo = new PassableShortInfo(authorJSON);
		}catch(Exception e){
			throw new Exception("Error: Problem trying to get author_info");
		}

		message = (String) safelyGet(parsedInput, "message", defaultLog.message);
		subjectType = (String) safelyGet(parsedInput, "subject_type", defaultLog.subjectType);
		
		String date = (String) safelyGet(parsedInput, "time", "");
		if(date.length() > 0)
			time = new ServerDate(date);
		else
			throw new Exception("Error: Problem trying to get time data");

		JSONArray dataArray = (JSONArray) safelyGet(parsedInput, "data", new JSONArray());
		data = new ArrayList();
		for(int i = 0; i < dataArray.length(); ++i){
			data.add(dataArray.get(i));
		}
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception{
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("author_info", authorInfo.toJSONObject());
		returnJSONObj.put("time", time.toString());
		returnJSONObj.put("subject_type", subjectType.toLowerCase());
		returnJSONObj.put("message", message);
		JSONArray paramJSON = new JSONArray();
		for(int i = 0; i < data.size(); ++i){
			paramJSON.put(data.get(i));
		}
		returnJSONObj.put("data", paramJSON);
		return returnJSONObj;
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public String toJSON() throws Exception{
		return toJSONObject().toString();
	}

	public boolean isBeingListened(){
		return true;
	}

	// example usage
	public static void main(String[] args) {
		PassableLog logEntry = new PassableLog();
		logEntry.subjectType = "module";
		logEntry.message = "I am the first log entry";
		logEntry.data.add("param 1");
		try{
			System.out.println(logEntry.toJSON());
			PassableLog logEntry2 = new PassableLog(logEntry.toJSON());
			logEntry2.authorInfo = new PassableShortInfo("4mdmin","user");
			logEntry2.data.add("param 2");
			logEntry2.message = "I am the second log entry";
			logEntry2.time = new ServerDate();
			System.out.println(logEntry2.toJSON());
		}catch(Exception e){
			System.out.println("Problem with log entry.");
		}
			
	}
}
