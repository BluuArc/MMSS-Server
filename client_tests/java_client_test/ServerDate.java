import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ServerDate{
    public LocalDateTime date;
    private static DateTimeFormatter formatter = null;

    public ServerDate(String inDate){
        if(formatter == null){
            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd kk:mm:ss"); 
        }
        date = LocalDateTime.parse(inDate,formatter);
    }

    public ServerDate(LocalDateTime inDate){
        date = inDate;
    }

    public ServerDate(){
        date = LocalDateTime.now();
    }

    private static String prependIfLessThan(String toPrepend, int value, int minimum){
        String valString = Integer.toString(value);
        if(value < minimum){
            return toPrepend + valString;
        }else{
            return valString;
        }
    }

    public String toString(){
        int commonMinimum = 10;
        String commonPrepend = "0";
        String msg = "";

        //get date information
        msg += date.getYear() + "-";
        msg += prependIfLessThan(commonPrepend,date.getMonth().getValue(),commonMinimum) + "-";
        msg += prependIfLessThan(commonPrepend,date.getDayOfMonth(),commonMinimum) + " ";

        //get time information
        msg += prependIfLessThan(commonPrepend,date.getHour(),commonMinimum) + ":";
        msg += prependIfLessThan(commonPrepend,date.getMinute(),commonMinimum) + ":";
        msg += prependIfLessThan(commonPrepend,date.getSecond(),commonMinimum);
        return msg;
    }

    public static void main(String[] args){
        ServerDate d = new ServerDate("2017-03-26 15:53:32");
        System.out.println(d);
        ServerDate d2 = new ServerDate(d.date);
        System.out.println(d2);
        ServerDate d3 = new ServerDate();
        System.out.println(d3);
    }
}