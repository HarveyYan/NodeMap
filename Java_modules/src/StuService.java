package src;


import java.io.File;
import java.util.ArrayList;

import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;

public class StuService {
	public static int getRows(String file){
		int rows = 0;
		try {
			Workbook rwb=Workbook.getWorkbook(new File(file));
			Sheet rs=rwb.getSheet(0);//或者rwb.getSheet(0)
		    rows=rs.getRows();//得到所有的行; 
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return rows;
		
	}
	

	public static ArrayList<String>  getAllByExcel(String file){
		ArrayList<String> list=new ArrayList<String>();
		try {
			Workbook rwb=Workbook.getWorkbook(new File(file));
			Sheet rs=rwb.getSheet(0);//或者rwb.getSheet(0)
			int rows=rs.getRows();//得到所有的行; 
			
			for (int i = 1; i < rows; i++) {
				  
					String str1=rs.getCell(0, i).getContents().substring(10, 28);//默认最左边编号也算一列 所以这里得j++
					
					String str=String.format("%s",str1);
					list.add(str);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return list;
		
	}
	public static String  getAllByExcel(String file,String speedLimit,int row){
		ArrayList<String> list=new ArrayList<String>();
		String str=null;
		try {
			Workbook rwb=Workbook.getWorkbook(new File(file));
			Sheet rs=rwb.getSheet(0);//或者rwb.getSheet(0)
			Double d=Double.parseDouble(speedLimit);
			d*=(Math.random()+1);
		    Double dH=d*0.6,dM=d*0.5;
					String str1=rs.getCell(0, row).getContents().substring(0, 16);//默认最左边编号也算一列 所以这里得j++
					String str2=rs.getCell(1, row).getContents();
					String str3=rs.getCell(3, row).getContents();
					Double double1=Double.parseDouble(str3);
					str1=str1.replaceAll("-","");
					str1=str1.replaceAll(" ","");
					str1=str1.replaceAll(":","");
					if(double1>dH){
						str3=str3+",\"green\"";
					}
					else if(double1>dM){
						str3=str3+",\"yellow\"";
					}else{
						str3=str3+",\"red\"";
					}
					if(str3.equals("NaN,\"red\"")){
						str3="0,\"green\"";
					}
					
					str=String.format("[%s,%s,%s]",str1,str2.substring(0,str2.indexOf('.')+2),str3);
					
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		return str;
		
	}
	public static void getAll(String file,String speedLimit,ArrayList<String> strstem,ArrayList<String> calculate,ArrayList<String> time){
		try {
			Workbook rwb=Workbook.getWorkbook(new File(file));
			Sheet rs=rwb.getSheet(0);//或者rwb.getSheet(0)
			int rows=rs.getRows();//得到所有的行; 
			Double d=Double.parseDouble(speedLimit);
		    Double dH=d*0.6,dM=d*0.5;
		    int j=0;
		    for(int i=0;i<time.size();i++){
		    	Cell cell=rs.findCell(time.get(i));
	    		String str4=null;
		    	if(cell!=null){
		    		j=cell.getRow();
		    		String str2=rs.getCell(1, j).getContents();
					String str3=rs.getCell(3, j).getContents();
					if(str3.contains(".")){
						str3=str3.substring(0,str3.indexOf(".")+2);
					}
					Double double1=Double.parseDouble(str3);
				  String str5=null;
					if(double1>dH){
						str3=str3+",1";
						str4="1,0,0,0";
						str5=str2+",0,0";
					}
					else if(double1>dM){
						str3=str3+",2";
						str4="0,1,0,0";
						str5="0,"+str2+",0";
					}else{
						str3=str3+",3";
						str4="0,0,1,0";
						str5="0,0,"+str2;
					}
					if(str3.equals("NaN,3")){
						str3="0,1";
						double1=0.0;
						str4="1,0,0,0";
						str5="0,0,0";
					}
				
						String str=String.format("[%s,%s],",str2,str3);
						strstem.set(i, strstem.get(i)+str);
						
							if(calculate.get(i).equals("[")){
								Double dtemp=Double.parseDouble(str2);
								double1*=dtemp;
								calculate.set(i,"["+double1.toString()+","+str2+","+str4+","+str5);
							}
							else{
								String cstr=calculate.get(i).substring(1);
								String[] strArray = null,strArray1=null;   
					      		strArray = cstr.split(",");
					      		strArray1 = str4.split(",");
					      		Double dtemp=Double.parseDouble(str2);
								double1*=dtemp;
								double1+=Double.parseDouble(strArray[0]);
								dtemp+=Double.parseDouble(strArray[1]);
								int istr2=Integer.parseInt(str2);
								int i1=Integer.parseInt(strArray[2])+Integer.parseInt(strArray1[0]),
									i2=Integer.parseInt(strArray[3])+Integer.parseInt(strArray1[1]),
									i3=Integer.parseInt(strArray[4])+Integer.parseInt(strArray1[2]),
									i4=Integer.parseInt(strArray[5])+Integer.parseInt(strArray1[3]),
									i5=Integer.parseInt(strArray[6])+Integer.parseInt(strArray1[0])*istr2,
									i6=Integer.parseInt(strArray[7])+Integer.parseInt(strArray1[1])*istr2,
									i7=Integer.parseInt(strArray[8])+Integer.parseInt(strArray1[2])*istr2;
								calculate.set(i,"["+double1.toString()+","+dtemp.toString()+","+i1+","+i2+","+i3+","+i4+","+i5+","+i6+","+i7);
							}				
					
						
		    	}
		    	else{
		    		String str="[0,0,4],";
					strstem.set(i, strstem.get(i)+str);
					str4="0,0,0,1";
					if(calculate.get(i).equals("[")){
						calculate.set(i,"[0,0,"+str4+",0,0,0");
					}
					else{
						String cstr=calculate.get(i).substring(1);
						String[] strArray = null,strArray1=null;   
			      		strArray = cstr.split(",");
			      		strArray1 = str4.split(",");
						int i1=Integer.parseInt(strArray[2])+Integer.parseInt(strArray1[0]),
							i2=Integer.parseInt(strArray[3])+Integer.parseInt(strArray1[1]),
							i3=Integer.parseInt(strArray[4])+Integer.parseInt(strArray1[2]),
							i4=Integer.parseInt(strArray[5])+Integer.parseInt(strArray1[3]);
						calculate.set(i,"["+strArray[0]+","+strArray[1]+","+i1+","+i2+","+i3+","+i4+","+strArray[6]+","+strArray[7]+","+strArray[8]);
					}				
		    		
		    	}
		        
		    	
		    	
		    }
			for (int i = 1; i < rows; i++) {
				  
					
					
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		
		
	}
}
