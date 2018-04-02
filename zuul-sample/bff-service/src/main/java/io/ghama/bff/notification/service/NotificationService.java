package io.ghama.bff.notification.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.notification.dao.NotificationDAO;

@Service("notificationService")
public class NotificationService {
	
	@Autowired
	private NotificationDAO notificationDAO;
 
	public List<Content> getNotifications() {
		List<Content> contents = notificationDAO.getNotifications();
		return contents;
	}
}
