package com.skcc.bff.history.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.history.dao.HistoryDAO;

@Service("historyService")
public class HistoryService {
	
	@Autowired
	private HistoryDAO historyDAO;
	
	public List<Content> getHistories(String username, String profile) {
		List<Content> histories = historyDAO.getHistories(username, profile);
		return histories;
	}
	
}
