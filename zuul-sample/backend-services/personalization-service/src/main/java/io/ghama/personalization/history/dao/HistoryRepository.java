package io.ghama.personalization.history.dao;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Repository;

import io.ghama.personalization.history.vo.History;

@Repository
public class HistoryRepository {
	
	private final static String PROFILE_PREFIX = "history:";
	
	@Autowired
	@Qualifier("historyRedisTemplate")
	private RedisTemplate<String, History> redisTemplate;
	
	@Resource(name = "historyRedisTemplate")
	private SetOperations<String, History> setOps;
	
    public List<History> findByUsername(String username, String profile) {
		Set<History> histories = setOps.members(PROFILE_PREFIX + username + ":" + profile);
		List<History> list = Arrays.asList(histories.toArray(new History[]{}));
		return list;  
	}

}
