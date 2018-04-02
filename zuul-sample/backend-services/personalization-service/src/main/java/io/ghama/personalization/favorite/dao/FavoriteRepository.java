package io.ghama.personalization.favorite.dao;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Repository;

import io.ghama.personalization.favorite.vo.Favorite;

@Repository
public class FavoriteRepository {

	private final static String PROFILE_PREFIX = "favorite:";
	
	@Autowired
	@Qualifier("favoriteRedisTemplate")
	private RedisTemplate<String, Favorite> redisTemplate;
	
	@Resource(name = "favoriteRedisTemplate")
	private SetOperations<String, Favorite> setOps;
	
    public List<Favorite> findByUsername(String username, String profile) {
		Set<Favorite> favorites = setOps.members(PROFILE_PREFIX + username + ":" + profile);
		List<Favorite> list = Arrays.asList(favorites.toArray(new Favorite[]{})); 
		return list; 
	}
}
