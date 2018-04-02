package io.ghama.recommendation.notification.dao;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Repository;

import io.ghama.recommendation.notification.vo.Notification;

@Repository
public class NotificationRepository {

	private final static String NOTIFICATION_PREFIX = "notification:";
	
	@Autowired
	@Qualifier("notificationRedisTemplate")
	private RedisTemplate<String, Notification> redisTemplate;
	
	@Resource(name = "notificationRedisTemplate")
	private SetOperations<String, Notification> setOps;

	public List<Notification> findByNotiDate(String notiDate) {
		List<Notification> list = Arrays.asList(setOps.members(NOTIFICATION_PREFIX + notiDate).toArray(new Notification[]{}));
		return list; 
	}

}
