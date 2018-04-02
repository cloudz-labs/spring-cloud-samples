package io.ghama.bff.notification.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import io.ghama.bff.contents.vo.Content;

@Repository("notificationDAO")
public class NotificationDAO {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.recommendation-service}")
	private String serviceUrl;
	
	public List<Content> getNotifications() {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/notifications", serviceUrl), Content[].class));
    }

}