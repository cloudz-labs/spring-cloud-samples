package io.ghama.account;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import io.ghama.account.account.vo.Account;
import io.ghama.account.profile.vo.Profile;

@Configuration
public class ServiceConfiguration {

	@Bean
	@Qualifier("accountRedisTemplate")
	public RedisTemplate<String, Account> accountRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Account> template = new RedisTemplate<String, Account>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Account.class));
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	@Qualifier("profileRedisTemplate")
	public RedisTemplate<String, Profile> profileRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Profile> template = new RedisTemplate<String, Profile>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Profile.class));
		template.afterPropertiesSet();
		return template;
	}
	
}
