package io.ghama.recommendation;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.client.RestTemplate;

import io.ghama.recommendation.notification.vo.Notification;
import io.ghama.recommendation.promotion.vo.Promotion;

@Configuration
public class ServiceConfiguration {
	
	@Bean
	@LoadBalanced
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	@Qualifier("notificationRedisTemplate")
	public RedisTemplate<String, Notification> notificationRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Notification> template = new RedisTemplate<String, Notification>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Notification.class));
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	@Qualifier("promotionRedisTemplate")
	public RedisTemplate<String, Promotion> promotionRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Promotion> template = new RedisTemplate<String, Promotion>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Promotion.class));
		template.afterPropertiesSet();
		return template;
	}
}
