package io.ghama.recommendation.notification.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.recommendation.contents.vo.Content;
import io.ghama.recommendation.notification.service.NotificationsService;

@RestController
@RequestMapping("/v1")
public class NotificationsController {
	
	@Autowired
	private NotificationsService notificationsService;
	
	@RequestMapping(path="/notifications", method=RequestMethod.GET, name="getNotifications")
	public List<Content> getNotifications() throws Exception {
		String notiDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date()); //"2017-02-07";
		List<Content> notifications = notificationsService.getNotifications(notiDate);
		return notifications;
	}
}
