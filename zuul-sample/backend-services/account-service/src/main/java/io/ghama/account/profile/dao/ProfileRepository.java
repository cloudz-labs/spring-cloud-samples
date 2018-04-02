package io.ghama.account.profile.dao;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Repository;

import io.ghama.account.profile.vo.Profile;

@Repository
public class ProfileRepository {
	
	private final static String PROFILE_PREFIX = "profile:";
	
	@Autowired
	@Qualifier("profileRedisTemplate")
	private RedisTemplate<String, Profile> redisTemplate;
	
	@Resource(name = "profileRedisTemplate")
	private SetOperations<String, Profile> setOps;
	
    public List<Profile> findByUsername(String username) {
		Set<Profile> profiles = setOps.members(PROFILE_PREFIX + username);
		List<Profile> list = Arrays.asList(profiles.toArray(new Profile[]{}));
		return list; 
	}

}
