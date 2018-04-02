package io.ghama.bff.history.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.history.service.HistoryService;

@RestController
@RequestMapping("/v1")
public class HistoryController {

	@Autowired
	private HistoryService historyService;
	
	@RequestMapping(path="/histories", method=RequestMethod.GET, name="getHistories")
	public List<Content> getHistories(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		String username = session.getAttribute("username").toString();
		String profile = session.getAttribute("profile").toString();
		
		List<Content> histories = historyService.getHistories(username, profile); 
		return histories;
	}

}
