package io.ghama.personalization;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.web.client.RestTemplate;

import io.ghama.personalization.favorite.vo.Favorite;
import io.ghama.personalization.history.vo.History;

@Configuration
public class ServiceConfiguration {
	
	@Bean
	@LoadBalanced
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

	@Bean
	@Qualifier("favoriteRedisTemplate")
	public RedisTemplate<String, Favorite> favoriteRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Favorite> template = new RedisTemplate<String, Favorite>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Favorite.class));
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	@Qualifier("historyRedisTemplate")
	public RedisTemplate<String, History> historyRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, History> template = new RedisTemplate<String, History>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(History.class));
		template.afterPropertiesSet();
		return template;
	}

}
