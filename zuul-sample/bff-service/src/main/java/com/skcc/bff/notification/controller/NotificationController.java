package com.skcc.bff.notification.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.notification.service.NotificationService;

@RestController
@RequestMapping("/v1")
public class NotificationController {
	
	@Autowired
	private NotificationService notificationService;
 
	@RequestMapping(path="/notifications", method=RequestMethod.GET, name="getNotifications")
	public List<Content> getNotifications() {
		List<Content> notifications = notificationService.getNotifications();
		return notifications;
	}
}
