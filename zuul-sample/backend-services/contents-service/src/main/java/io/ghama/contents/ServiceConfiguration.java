package io.ghama.contents;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import io.ghama.contents.category.vo.Category;
import io.ghama.contents.content.vo.Content;
import io.ghama.contents.content.vo.Episode;
import io.ghama.contents.content.vo.Trailer;

@Configuration
public class ServiceConfiguration {

	@Bean
	@Qualifier("categoryRedisTemplate")
	public RedisTemplate<String, Category> categoryRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Category> template = new RedisTemplate<String, Category>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Category.class));
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	@Qualifier("contentRedisTemplate")
	public RedisTemplate<String, Content> contentRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Content> template = new RedisTemplate<String, Content>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Content.class));
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	@Qualifier("episodeRedisTemplate")
	public RedisTemplate<String, Episode> episodeRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Episode> template = new RedisTemplate<String, Episode>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Episode.class));
		template.afterPropertiesSet();
		return template;
	}
	
	@Bean
	@Qualifier("trailerRedisTemplate")
	public RedisTemplate<String, Trailer> trailerRedisTemplate(JedisConnectionFactory jedisConnectionFactory) {
		RedisTemplate<String, Trailer> template = new RedisTemplate<String, Trailer>();
		template.setConnectionFactory(jedisConnectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new Jackson2JsonRedisSerializer<>(Trailer.class));
		template.afterPropertiesSet();
		return template;
	}
}
