package io.ghama.recommendation.notification.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import io.ghama.recommendation.contents.vo.Content;
import io.ghama.recommendation.notification.dao.NotificationRepository;
import io.ghama.recommendation.notification.vo.Notification;

@Service("notificationsService")
public class NotificationsService {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private NotificationRepository notificationRepository;
	
	public List<Content> getNotifications(String notiDate) {
		List<Content> contents = new ArrayList<Content>();
		
		List<Notification> list = notificationRepository.findByNotiDate(notiDate);
		list.forEach(notification -> {
			Content content = restTemplate.getForObject("http://contents-service/v1/contents/{content_id}", Content.class, notification.getContent());
			contents.add(content);
		});
		
		return contents;
	}
	
}
