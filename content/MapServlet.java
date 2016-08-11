package com.mapView;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MapServlet extends HttpServlet {
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int[]color=new int[2000];
		for(int i=0;i<2000;i++){
			
			color[i]=(int) Math.ceil(Math.random()*300);
			
		}
		
		request.getSession().setAttribute("color", color);
		request.getRequestDispatcher("/map/lines-bmap-effect.jsp").forward(request, response);
	}
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {		
		this.doGet(request, response);
	}

}
