package src;

import java.io.*;
import java.util.ArrayList;

import net.sf.json.JSONObject;

public class Change {
	 public static void listfile(File file,ArrayList<String> strs) {
		 //如果file代表的不是一个文件，而是一个目录
		 if (!file.isFile()) {
			 //列出该目录下的所有文件和目录
			 File files[] = file.listFiles();
			 //遍历files[]数组
			 if (files == null) {
				 System.out.println("...............................");
				 return;
			 }
			 for (File f : files) {
				 //递归
				 listfile(f, strs);
			 }
		 } else {
			 strs.add(file.getName());
		 }
	 }

	 //保存相同的文件名
	 public static  ArrayList<String> saveSame(String linePath,String statePath){
		 ArrayList<String> strs=new ArrayList<String> (),strs1=new ArrayList<String> (),strs2=new ArrayList<String> ();
		 listfile(new File(linePath),strs1);
		 listfile(new File(statePath),strs2);
		 for(int i=0;i<strs1.size();i++){
			 String str=strs1.get(i).subSequence(0, strs1.get(i).indexOf('.'))+".xls";
			 if(strs2.contains(str)){
				 strs.add((String) strs1.get(i).subSequence(0, strs1.get(i).indexOf('.')));
			 }
		 }
		 return strs;
		  
	 }

	 public static  ArrayList<String> onDirectName(String path){
		 String regex = "[0-9]{4}-[0-9]{2}-[0-9]{2}";
		 File file= new File(path);
		 ArrayList<String> strs=new ArrayList<String>();
		 if(!file.isFile()){
			 //列出该目录下的所有文件和目录
			 File files[] = file.listFiles();
			 //遍历files[]数组
			 if(files==null){
				 System.out.println("empty folder at: " + path);

			 }
			 for(File f : files){
				 if(!f.isFile()){
					 strs.add(f.getName());
				 }
			 }
			 for(int i=0;i<strs.size();i++){
				 if(!strs.get(i).matches(regex)){
					 System.out.println(strs.get(i)+" removed");
					 strs.remove(i);
				 }
			 }
			 return strs;
		 }
		 else{
			 System.out.println("路径指向的是文件，不是文件夹");
			 return null;
		 }	 
	 }
	

	public static String ReadFile(String path){
	     File file = new File(path);
	     BufferedReader reader = null;
	     String laststr = "";
	     try {
	      	//System.out.println("以行为单位读取文件内容，一次读一整行：");
	      	reader = new BufferedReader(new FileReader(file));
	      	String tempString = null;
	      	while ((tempString = reader.readLine()) != null) {
	       		laststr = laststr+tempString;
			}
	      	reader.close();
	     } catch (IOException e) {
	      	e.printStackTrace();
	     } finally {
	      	if (reader != null) {
	       		try {
	        		reader.close();
	       		} catch (IOException e1) {
	       		}
	      	}
	     }
	     return laststr;
	 }
	
    public static String readJson(String inPath) throws IOException{

		File inFile=new File(inPath);
    	if(inFile.exists()){
			FileReader reader =new FileReader(inFile);
			BufferedReader bufferReader=new BufferedReader(reader);
			String line =null,str=null;		
			String latitude,longitude;
			latitude=null;
			longitude=null;
			StringBuilder strB=new  StringBuilder("");
			while((line=bufferReader.readLine())!=null){	
				if(line.length()>16){
					if(line.substring(9, 17).equals("latitude")){						
						latitude=line.substring(20, line.length()-1);
					}
					if(line.substring(9, 18).equals("longitude")){						
						longitude=line.substring(21,line.length());
					    strB.append(String.format("%s,%s;", longitude,latitude));
					}		
				}
				if(line.equals("  ]")){
				    str=strB.toString();
					str=str.substring(0, str.length()-1);
			
				    str=BaiduApi.testPost(str);
				    str=String.format("[%s]",str);
				  
				}
			}
			bufferReader.close();
			 return str;
		}
		else{
			System.out.println("file not exit");	
			return null;
		}
    	
    }
	public static void main(String[] args) throws IOException{
		String path ="/usr/local/nodejsapp/app/Java_modules/excels_data";
		String outFolder = "/usr/local/nodejsapp/app/content/snaptoroads";
		new File(outFolder).mkdirs();
		ArrayList<String> strs=onDirectName(path);	//日期
		ArrayList<String> lineList=new ArrayList<String> ();
		for(String s:strs){
			ArrayList<String> fileNameList=new ArrayList<String> ();
			String linePath="/usr/local/nodejsapp/app/Java_modules/snappedPoints",statePath=path+"/"+s+"/avg_speed";
		   	if(fileNameList.isEmpty()){
			   	fileNameList=saveSame(linePath,statePath);	//道路json和状态xls共同的部分, a.k.a 需要parse的路段
				if (fileNameList.size()==0) {
					System.out.println(statePath + " is empty");
					continue;
				}
		   	}

			String outPath=outFolder+"/"+s+".json";	//输出文件
			File outFile=new File(outPath);
			FileWriter writer=new FileWriter(outFile);
			BufferedWriter bufferWriter=new BufferedWriter(writer);
			bufferWriter.write("{");
			bufferWriter.newLine();
			String str =null;

			bufferWriter.write("\"lines\":[");
			bufferWriter.newLine();

		   	if(lineList.isEmpty()){
			   //order inherited from fileNameList
			   for(int i=0;i<fileNameList.size()-1;i++){
				   String inPath=linePath+"/"+fileNameList.get(i)+".json";
				   str=readJson(inPath);
				   lineList.add(str+",");
			   }
			   String inPath=linePath+"/"+fileNameList.get(fileNameList.size()-1)+".json";
			   str=readJson(inPath);
			   lineList.add(str);
			   for(int i=0;i<fileNameList.size();i++){
				   System.out.print(i);
				   System.out.println(String.format("\"%s\":,", fileNameList.get(i)));
			   }
		   	}
		   
		  	for(String strtemp:lineList){
		  		bufferWriter.write(strtemp);
		  		bufferWriter.newLine();
		  	}		
			bufferWriter.write("],");
			bufferWriter.newLine();	
			bufferWriter.write("\"timelines\":[");
			bufferWriter.newLine();
			
			ArrayList<String>  strs1=StuService.getAllByExcel("/usr/local/nodejsapp/app/Java_modules/#6-#10.xls");	//获取timeline

			String strtemp=s;//.replaceAll("-","")
			
			for(int i=0;i<strs1.size();i++){
				strs1.set(i,strtemp+strs1.get(i));
			}
			int j0=0;
			for(String str1:strs1){
				str1=str1.substring(0,16);
				str1=str1.replaceAll(" ","");
				str1=str1.replaceAll("-","");
				str1=str1.replaceAll(":","");
				if(j0<strs1.size()-1){
					str1=str1+",";
				}
				
				bufferWriter.write(str1);
				j0++;
			}
			bufferWriter.write("],");
			bufferWriter.newLine();	
			bufferWriter.write("\"series\":[");
			bufferWriter.newLine();
			int rows=StuService.getRows("/usr/local/nodejsapp/app/Java_modules/#6-#10.xls");
			ArrayList<String> strstem=new ArrayList<String>(),calculate=new ArrayList<String>();
			for(int j=0;j<rows-1;j++){
				strstem.add("[");
				calculate.add("[");
			}
			String pathtemp ="/usr/local/nodejsapp/app/Java_modules/speedLimit.json";
			String strSpeedLimit=ReadFile(pathtemp);
			JSONObject jo=JSONObject.fromObject(strSpeedLimit);
			for(int j=0;j<fileNameList.size();j++){
				strSpeedLimit=jo.get(fileNameList.get(j)).toString();
				StuService.getAll(statePath+"/"+fileNameList.get(j)+".xls",strSpeedLimit, strstem,calculate,strs1);
			}
			for(int j=0;j<rows-2;j++){
				strstem.set(j, strstem.get(j).substring(0,strstem.get(j).length()-1)+"],");
				 bufferWriter.write(strstem.get(j));
					bufferWriter.newLine();	
			}
			bufferWriter.write(strstem.get(rows-2).substring(0, strstem.get(rows-2).length()-1));
			bufferWriter.newLine();	
	        		
			 bufferWriter.write("]");
				bufferWriter.newLine();	
			    bufferWriter.write("],");
				bufferWriter.newLine();	
				 
				bufferWriter.write("\"averageSpeed\":[");
				bufferWriter.newLine();	
				for(int i=1;i<calculate.size();i++){
					String cstr=calculate.get(i-1).substring(1);
					String[] strArray = null;   
		      		strArray = cstr.split(",");		      		
		      		Double c1,c2;
					c1=Double.parseDouble(strArray[0]);
					c2=Double.parseDouble(strArray[1]);
					c1/=c2;
					String stemp=c1.toString();
					if(stemp.contains(".")){
						stemp=stemp.substring(0,stemp.indexOf(".")+2);
					}
					bufferWriter.write(stemp+",");
				}
				String cstr=calculate.get(calculate.size()-1).substring(1);
				String[] strArray = null;   
				strArray = cstr.split(",");	      		
	      		Double c1,c2;
				c1=Double.parseDouble(strArray[0]);
				c2=Double.parseDouble(strArray[1]);
				c1/=c2;
				String stemp=c1.toString();
				if(stemp.contains(".")){
					stemp=stemp.substring(0,stemp.indexOf(".")+2);
				}
				
				bufferWriter.write(stemp);
				bufferWriter.newLine();	
				bufferWriter.write("],");
				bufferWriter.newLine();	
				bufferWriter.write("\"totalNumber\":[");
				bufferWriter.newLine();	
				for(int i=1;i<calculate.size();i++){
					String cstr1=calculate.get(i-1).substring(1);
					String[] strArray1 = null;   
		      		strArray1 = cstr1.split(",");		      		
		      		Double c21;
					c21=Double.parseDouble(strArray1[1]);
				
					String stemp2=c21.toString();
					
					if(stemp2.contains(".")){
						stemp2=stemp2.substring(0,stemp2.indexOf("."));
					}
					bufferWriter.write(stemp2+",");
				}
				String cstr1=calculate.get(calculate.size()-1).substring(1);
				String[] strArray1 = null;   
				strArray1 = cstr1.split(",");	      		
	      		Double c21;
				
				c21=Double.parseDouble(strArray1[1]);
				
				String stemp2=c21.toString();
				
				if(stemp2.contains(".")){
					stemp2=stemp2.substring(0,stemp2.indexOf("."));
				}
				bufferWriter.write(stemp2);
				bufferWriter.newLine();	
				bufferWriter.write("],");
				bufferWriter.newLine();	
				bufferWriter.write("\"roadColor\":[");
				bufferWriter.newLine();	
				for(int i=1;i<calculate.size();i++){
					String cstr2=calculate.get(i-1).substring(1);
					String[] strArray2 = null;   
		      		strArray2 = cstr2.split(",");		      		
		      		int i1=Integer.parseInt(strArray2[2]),
							i2=Integer.parseInt(strArray2[3]),
							i3=Integer.parseInt(strArray2[4]),
							i4=Integer.parseInt(strArray2[5]);
					bufferWriter.write("["+i1+","+i2+","+i3+","+i4+"],");
				}
				String cstr2=calculate.get(calculate.size()-1).substring(1);
				String[] strArray2 = null;   
				strArray2 = cstr2.split(",");	      		
				int i1=Integer.parseInt(strArray2[2]),
						i2=Integer.parseInt(strArray2[3]),
						i3=Integer.parseInt(strArray2[4]),
						i4=Integer.parseInt(strArray2[5]);
						
				bufferWriter.write("["+i1+","+i2+","+i3+","+i4+"]");
				bufferWriter.newLine();	
				bufferWriter.write("],");
				bufferWriter.newLine();
				bufferWriter.write("\"carsColor\":[");
				bufferWriter.newLine();	
				for(int i=1;i<calculate.size();i++){
					String cstr21=calculate.get(i-1).substring(1);
					String[] strArray21 = null;   
		      		strArray21 = cstr21.split(",");		      		
		      		int 	i5=Integer.parseInt(strArray21[6]),
							i6=Integer.parseInt(strArray21[7]),
							i7=Integer.parseInt(strArray21[8]);
					bufferWriter.write("["+i5+","+i6+","+i7+"],");	
				}
				String cstr21=calculate.get(calculate.size()-1).substring(1);
				String[] strArray21 = null;   
				strArray21 = cstr21.split(",");	      		
				int 	i5=Integer.parseInt(strArray21[6]),
						i6=Integer.parseInt(strArray21[7]),
						i7=Integer.parseInt(strArray21[8]);
				bufferWriter.write("["+i5+","+i6+","+i7+"]");
				bufferWriter.newLine();	
				bufferWriter.write("]");
				bufferWriter.newLine();	
				
				bufferWriter.write("}");
				bufferWriter.newLine();
				bufferWriter.flush();
				bufferWriter.close();
				System.out.println("写入成功，路径为："+outFile.getAbsolutePath());
	     try {
			Thread.sleep(1);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		}
				
	}

	}