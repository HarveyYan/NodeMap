package com.mapView.main;

import java.io.*;
import java.util.Map;

public class Change {
	

	public static void main(String[] args) throws IOException{
		Map<String, String> json ;

		
		String inPath="D:\\snapToRoads.json",outPath="C:\\Users\\wxw\\Desktop\\snapToRoads.json";
		//String path="E:\\line.txt";
		File inFile=new File(inPath),outFile=new File(outPath);
		if(inFile.exists()){
			FileReader reader =new FileReader(inFile);
			FileWriter writer=new FileWriter(outFile);
			
			BufferedReader bufferReader=new BufferedReader(reader);
			BufferedWriter bufferWriter=new BufferedWriter(writer);
			String line =null;
			int i=0,j=0;
			/*
			while((line=bufferReader.readLine())!=null){
				if(line.equals("["))
				{
					System.out.println("[");
					bufferWriter.write(line);
				}
				else if(line.equals("]")){
					System.out.println("]");
					bufferWriter.newLine();
					bufferWriter.write(line);
				}
				else{
					bufferWriter.newLine();
					i=(i+50)%200;
					String newLine= String.format("  [%s, %s",i,line.substring(4, line.length()));
					System.out.println(newLine);
					bufferWriter.write(newLine);
					//System.out.println(line);
				}
				j++;
				
			}
			System.out.println(j);
			bufferReader.close();
			bufferWriter.flush();
			bufferWriter.close();
			System.out.println("写入成功，路径为："+outFile.getAbsolutePath());
			}
			*/
			System.out.println("[");
			bufferWriter.write("[");
			bufferWriter.newLine();
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
					String str=strB.toString();
					str=str.substring(0, str.length()-1);
					System.out.println(str);
				    str=BaiduApi.testPost(str);
				    System.out.println(str);
				    bufferWriter.write("[");
				    bufferWriter.write(str);
				    bufferWriter.write("]");
					bufferWriter.newLine();
				}
			}
			
			
			System.out.println("]");
			bufferWriter.write("]");
			bufferWriter.newLine();
			bufferReader.close();
			bufferWriter.flush();
			bufferWriter.close();
			System.out.println("写入成功，路径为："+outFile.getAbsolutePath());

				
		}
		else{
			System.out.println("file not exit");	
		}
		
	
		
		
		
	}

	}