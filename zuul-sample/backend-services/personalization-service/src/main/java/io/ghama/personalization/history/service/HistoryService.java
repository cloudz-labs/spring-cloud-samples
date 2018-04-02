package io.ghama.personalization.history.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import io.ghama.personalization.contents.vo.Content;
import io.ghama.personalization.history.dao.HistoryRepository;
import io.ghama.personalization.history.vo.History;

@Service("historyService")
public class HistoryService {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private HistoryRepository historyRepository;
	
	public List<Content> getHistories(String username, String profile) {
		List<Content> contents = new ArrayList<Content>();
		
		List<History> histories = historyRepository.findByUsername(username, profile);
		histories.forEach(history -> {
			Content content = restTemplate.getForObject("http://contents-service/v1/contents/{content}", Content.class, history.getContent());
			contents.add(content);
		});
		return contents;
	}

}
