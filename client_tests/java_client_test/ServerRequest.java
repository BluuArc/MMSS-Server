import java.io.*;
import java.net.*;
import java.util.*;

import javax.net.ssl.HttpsURLConnection;

//originally referenced from http://stackoverflow.com/questions/4205980/java-sending-http-parameters-via-post-method-easily
public class ServerRequest{

    //return the server response as a string
    private static String readResponse(Reader serverResponse) throws Exception {
        StringBuilder sb = new StringBuilder();
        String response;
        for (int c; (c = serverResponse.read()) >= 0;)
            sb.append((char) c);
        response = sb.toString();
        return response;
    }

    public static String get(String urlInput, Map<String,Object> params) throws Exception{
        URL url;
        Reader serverResponse;
        StringBuilder paramURL = new StringBuilder();

        //append params to end of URL
        paramURL.append(urlInput);
        if(params != null){
            //directly referenced from http://stackoverflow.com/questions/4205980/java-sending-http-parameters-via-post-method-easily
            for(Map.Entry<String,Object> param : params.entrySet()){
                if(paramURL.length() != 0) paramURL.append('&');
                paramURL.append(param.getKey());
                paramURL.append('=');
                paramURL.append(String.valueOf(param.getValue()));
            }
        }
        url = new URL(paramURL.toString());

        //open connection based on if it's an HTTP or HTTPS connection
        if (urlInput.indexOf("https") == 0) {
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        } else {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        }

        return readResponse(serverResponse);
    }

    public static String get(String urlInput) throws Exception{
        return get(urlInput,null);
    }

    //directly referenced from http://stackoverflow.com/questions/4205980/java-sending-http-parameters-via-post-method-easily
    public static String post(String urlInput, Map<String,Object> params) throws Exception{
        URL url = new URL (urlInput);
        Reader serverResponse;
        StringBuilder postData = new StringBuilder();
        
        for(Map.Entry<String,Object> param : params.entrySet()){
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

        //open connection based on if it's an HTTP or HTTPS connection
        if (urlInput.indexOf("https") == 0) {
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        } else {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        }

        return readResponse(serverResponse);
    }

    //directly referenced from http://stackoverflow.com/questions/4205980/java-sending-http-parameters-via-post-method-easily
    public static String delete(String urlInput, Map<String,Object> params) throws Exception{
        URL url = new URL (urlInput);
        Reader serverResponse;
        StringBuilder postData = new StringBuilder();
        
        for(Map.Entry<String,Object> param : params.entrySet()){
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

        //open connection based on if it's an HTTP or HTTPS connection
        if (urlInput.indexOf("https") == 0) {
            HttpsURLConnection connection = (HttpsURLConnection) url.openConnection();
            connection.setRequestMethod("DELETE");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        } else {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("DELETE");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            connection.setDoOutput(true);
            serverResponse = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
        }

        return readResponse(serverResponse);
    }
}