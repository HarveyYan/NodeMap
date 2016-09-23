package src;

import java.io.*;
import java.net.URL;
import java.net.URLConnection;


import org.apache.commons.lang.StringUtils;

public class BaiduApi {
	private static String ak="AoXg4xaOZP1RRzoSGPayoHlSvvaVs8tp";
	public static String testPost(String longLa)throws IOException{
		//	URL url=new URL("http://api.map.baidu.com/geocoder?ak="+ak+"&callback=renderReverse&location="+x+","+y+"&output=json");
			URL url=new URL("http://api.map.baidu.com/geoconv/v1/?coords="+longLa+"&from=3&to=5&ak="+ak+"&callback");			
			URLConnection connection = url.openConnection();  
			connection.setDoOutput(true);  
			OutputStreamWriter out=new OutputStreamWriter(connection.getOutputStream(),"utf-8");
			out.flush();
			out.close();
			String res;
			InputStream urlStream = null;
			while(urlStream == null) {
				try {
					urlStream = connection.getInputStream();
				} catch (java.io.IOException e) {

				}
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(urlStream,"utf-8"));
			StringBuilder sb=new  StringBuilder("");
			while((res= in.readLine())!=null){
				sb.append(res.trim());		       
			}
			String str=sb.toString();
			if(StringUtils.isNotEmpty(str)){				
				str=str.substring(str.indexOf("[{\"x\"")+1, str.length()-3);				
				StringBuilder strB=new  StringBuilder("");
	      		String[] strArray = null;   
	      		strArray = str.split(","); //拆分字符为"," ,然后把结果交给数组strArray 
	      		
	      		String strX=null,strY=null;
	      		for(int i=0;i<strArray.length;i+=2){
	      			strX=strArray[i];strY=strArray[i+1];
	      			int dot1=strX.indexOf("x"),dot3=strY.indexOf("y");
	      			//小数点后如果没有4位，需要改进。
		      		strB.append(String.format("%s,%s,",strY.substring(dot3+3,strY.length()-1),strX.substring(dot1+3)));			
      			}
	      		str=strB.toString();
	      		str=str.substring(0,str.length()-1);
			 return str;		
			}
		return null;
		}

}
