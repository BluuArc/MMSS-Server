import java.util.*;
import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

class PassableShortInfo implements Passable{
	public String type;
	public String id;

	public PassableShortInfo(){
		type = "none";
		id = "";
	}

	public PassableShortInfo(String inID, String inType){
		type = inType;
		id = inID;
	}

	private Object safelyGet(JSONObject json, String member, Object defaultValue){
		try{
			return json.get(member);
		}catch(Exception e){
			return defaultValue;
		}
	}

	public PassableShortInfo(String input) throws Exception{
		PassableShortInfo defaultPageInfo = new PassableShortInfo();
		JSONObject parsedInput = new JSONObject(input);
		type = (String) safelyGet(parsedInput, "type", defaultPageInfo.type);
		if(type.length() == 0){
			throw new Exception("Error: No type specified");
		}
		id = (String) safelyGet(parsedInput, "id", defaultPageInfo.id);
		if(id.length() == 0){
			throw new Exception("Error: ID is of length 0");
		}
	}

	public PassableShortInfo(JSONObject parsedInput) throws Exception{
		PassableShortInfo defaultPageInfo = new PassableShortInfo();
		type = (String) safelyGet(parsedInput, "type", defaultPageInfo.type);
		if(type.length() == 0){
			throw new Exception("Error: No type specified");
		}
		id = (String) safelyGet(parsedInput, "id", defaultPageInfo.id);
		if(id.length() == 0){
			throw new Exception("Error: ID is of length 0");
		}
	}

	//Exception shouldn't happen unless one or more of the values are invalid
	public String toJSON() throws Exception{
		return toJSONObject().toString();
	}

	public JSONObject toJSONObject() throws Exception{
		JSONObject returnJSONObj = new JSONObject();
		returnJSONObj.put("type", type);
		returnJSONObj.put("id", id);
		return returnJSONObj;
	}

	public boolean isBeingListened(){
		return true;
	}

	// example usage
	public static void main(String[] args) {
		PassableShortInfo myPage = new PassableShortInfo();
		myPage.id = "123";
		myPage.type = "module";
		try{
			System.out.println(myPage.toJSON());
			PassableShortInfo myPage2 = new PassableShortInfo(myPage.toJSON());
			myPage2.id = "456";
			myPage2.type = "user";
			System.out.println(myPage2.toJSON());
		}catch(Exception e){
			System.out.println("Respone is invalid");
		}
			
	}
}