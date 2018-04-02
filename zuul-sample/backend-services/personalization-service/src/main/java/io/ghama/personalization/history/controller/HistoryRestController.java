package io.ghama.personalization.history.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.personalization.contents.vo.Content;
import io.ghama.personalization.history.service.HistoryService;

@RestController
@RequestMapping("/v1")
public class HistoryRestController {
	
	@Autowired
	private HistoryService historyService;
	
	@RequestMapping(path="/{username}/{profile}/histories", method=RequestMethod.GET, name="getHistories")
	public List<Content> getHistories(@PathVariable(value = "username") String username, @PathVariable(value = "profile") String profile) {
		List<Content> histories = historyService.getHistories(username, profile); 
		return histories;
	}

}
