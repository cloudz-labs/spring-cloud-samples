package com.skcc.bff.notification.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.notification.dao.NotificationDAO;

@Service("notificationService")
public class NotificationService {
	
	@Autowired
	private NotificationDAO notificationDAO;
 
	public List<Content> getNotifications() {
		List<Content> contents = notificationDAO.getNotifications();
		return contents;
	}
}
