package io.ghama.bff.history.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.history.dao.HistoryDAO;

@Service("historyService")
public class HistoryService {
	
	@Autowired
	private HistoryDAO historyDAO;
	
	public List<Content> getHistories(String username, String profile) {
		List<Content> histories = historyDAO.getHistories(username, profile);
		return histories;
	}
	
}
