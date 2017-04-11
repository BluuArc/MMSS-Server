import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public class PassableResponse implements Passable{
	public boolean success;
	public String message;

	public PassableResponse(){
		success = false;
		message = "No message received or invalid response from server";
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableResponse(String input) throws Exception{
		PassableResponse defaultRespoonse = new PassableResponse();
		JSONObject parsedInput = new JSONObject(input);
		success = (boolean) safelyGet(parsedInput, "success", defaultRespoonse.success);
		if(success != true && success != false){//shouldn't happen
			throw new Exception("Error: Problem trying to get success boolean");
		}
		message = (String) safelyGet(parsedInput, "message", defaultRespoonse.message);
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public JSONObject toJSONObject() throws Exception {
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("success", success);
		returnJSONObj.put("message", message);
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
		PassableResponse myResponse = new PassableResponse();
		try{
			System.out.println(myResponse.toJSON());
			PassableResponse myResponse2 = new PassableResponse(myResponse.toJSON());
			myResponse2.success = true;
			myResponse2.message = "A whole new message";
			System.out.println(myResponse2.toJSON());
		}catch(Exception e){
			System.out.println("Respone is invalid");
		}
			
	}
}
