package io.ghama.contents.content.dao;

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import io.ghama.contents.content.vo.Content;

@Repository
public class ContentsRepository {
	
	private final static String CONTENTS_PREFIX = "content:";
	
	@Autowired
	@Qualifier("contentRedisTemplate")
	private RedisTemplate<String, Content> redisTemplate;
	
	@Resource(name = "contentRedisTemplate")
	private ValueOperations<String, Content> valueOps;
	
    public List<Content> findByCategory(String category) {
		Set<String> keys = redisTemplate.keys(CONTENTS_PREFIX + "*:*:" + category);
		List<Content> list = valueOps.multiGet(keys);
		return list;
	}

	public List<Content> findByTitle(String title) {
		Set<String> keys = redisTemplate.keys(CONTENTS_PREFIX + "*:*" + title + "*:*");
		List<Content> list = valueOps.multiGet(keys);
		list.sort((o1, o2) -> {
			return o1.getId().compareTo(o2.getId());
		});
		return list;
	}
 	
	public Content findById(String id) {
		Set<String> keys = redisTemplate.keys(CONTENTS_PREFIX + id + ":*");
		Content content = null;
		if (keys.iterator().hasNext()) {
			String key = keys.iterator().next();
			content = valueOps.get(key);
		}
		return content;
	}

}
