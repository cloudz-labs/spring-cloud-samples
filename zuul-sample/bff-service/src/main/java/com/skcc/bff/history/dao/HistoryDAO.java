package com.skcc.bff.history.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.skcc.bff.contents.vo.Content;

@Repository("historyDAO")
public class HistoryDAO {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.personalization-service}")
	private String serviceUrl;
	
	public List<Content> getHistories(String username, String profile) {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/%s/%s/histories", serviceUrl, username, profile), Content[].class));
    }
	
}
