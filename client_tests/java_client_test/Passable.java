import org.json.*;
//source: http://theoryapp.com/parse-json-in-java/

public interface Passable { 

	//Exception shouldn't happen unless one or more of the values are invalid
	public String toJSON() throws Exception;
	public JSONObject toJSONObject() throws Exception;
	public boolean isBeingListened();
}
