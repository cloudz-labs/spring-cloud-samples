package io.ghama.contents.content.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import io.ghama.contents.content.vo.Episode;

@Repository
public class EpisodeRepository {

	private final static String EPISODE_PREFIX = "episode:";
	
	@Autowired
	@Qualifier("episodeRedisTemplate")
	private RedisTemplate<String, Episode> redisTemplate;
	
	@Resource(name = "episodeRedisTemplate")
	private ValueOperations<String, Episode> valueOps;

	
	public List<Episode> findByContent(String content) {
		Set<String> keys = redisTemplate.keys(EPISODE_PREFIX + content + ":*");
		List<Episode> list = valueOps.multiGet(keys);
		return list;
	}
	
	public List<Integer> findSeasonsByContent(String content) {
		Set<String> keys = redisTemplate.keys(EPISODE_PREFIX + content + ":*");
		List<Integer> seasons = new ArrayList<Integer>();
		keys.forEach(key -> {
			int season = Integer.parseInt(key.split(":")[2]);
			if(!seasons.contains(season)) {
				seasons.add(season);
			}
		});
		seasons.sort((o1, o2) -> {
			return o1 - o2;
		});
		return seasons;
	}
	
	public List<Episode> findByContentAndSeason(String content, int season) {
		Set<String> keys = redisTemplate.keys(EPISODE_PREFIX + content + ":" + season + ":*");
		List<Episode> episodes = valueOps.multiGet(keys);
		episodes.sort((o1, o2) -> {
			return o1.getEpisode() - o2.getEpisode();
		});
		return episodes;
	}
	
	public Episode findOne(String content, int season, int episode) {
		Episode result = valueOps.get(EPISODE_PREFIX + content + ":" + season + ":" + episode);
		return result; 
	}
	
}
