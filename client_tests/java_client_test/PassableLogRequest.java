import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableLogRequest implements Passable{
	public String id;
	public ServerDate start_time;
	public ServerDate end_time;

	public PassableLogRequest(String inID, String inStart, String inEnd){
		id = inID;
		start_time = new ServerDate(inStart);
		if(inEnd != null){
			end_time = new ServerDate(inEnd);
		}else{
			end_time = new ServerDate();
		}
	}

	public PassableLogRequest(String inID, ServerDate inStart, ServerDate inEnd){
		id = inID;
		start_time = inStart;
		if(inEnd != null){
			end_time = inEnd;
		}else{
			end_time = new ServerDate();
		}
	}

	public PassableLogRequest(){
		id = "";
		start_time = new ServerDate();
		end_time = new ServerDate();
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableLogRequest(String input) throws Exception{
		PassableLogRequest defaultRequest = new PassableLogRequest();
		JSONObject parsedInput = new JSONObject(input);
		id = (String) safelyGet(parsedInput, "id", defaultRequest.id);
		if(id.length() == 0){//shouldn't happen
			throw new Exception("Error: Problem trying to get ID");
		}
		String date = (String) safelyGet(parsedInput, "start_time", "");
		if(date.length() > 0)
			start_time = new ServerDate(date);
		else
			throw new Exception("Error: Problem trying to get start date");

		date = (String) safelyGet(parsedInput, "end_time", "");
		if(date.length() == 0){
			end_time = new ServerDate();
		}else{
			end_time = new ServerDate(date);
		}
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception {
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("id", id);
		returnJSONObj.put("start_time", start_time.toString());
		returnJSONObj.put("end_time", end_time.toString());
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
		PassableLogRequest myRequest = new PassableLogRequest("abcde12345", "2017-03-01 00:00:00", null);
		try{
			System.out.println(myRequest.toJSON());
			PassableLogRequest myRequest2 = new PassableLogRequest(myRequest.toJSON());
			myRequest2.start_time = new ServerDate();
			myRequest2.end_time = new ServerDate();
			System.out.println(myRequest2.toJSON());
		}catch(Exception e){
			System.out.println("Something is invalid");
		}
			
	}
}
