package io.ghama.contents.content.dao;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import io.ghama.contents.content.vo.Trailer;

@Repository
public class TrailerRepository {

	private final static String TRAILER_PREFIX = "trailer:";
	
	@Autowired
	@Qualifier("trailerRedisTemplate")
	private RedisTemplate<String, Trailer> redisTemplate;
	
	@Resource(name = "trailerRedisTemplate")
	private ListOperations<String, Trailer> listOps;

	public List<Trailer> findByContent(String content) {
		List<Trailer> list = listOps.range(TRAILER_PREFIX + content, 0, -1);
		return list;
	}

}
