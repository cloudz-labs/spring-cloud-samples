package io.ghama.contents.category.dao;

import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import io.ghama.contents.category.vo.Category;
  
@Repository
public class CategoryRepository {
	
	private final static String CATEGORY_PREFIX = "category:";
	
	@Autowired
	@Qualifier("categoryRedisTemplate")
	private RedisTemplate<String, Category> redisTemplate;
	
	@Resource(name = "categoryRedisTemplate")
	private ValueOperations<String, Category> valueOps;
 
	public List<Category> findAll() {
		Set<String> keys = redisTemplate.keys(CATEGORY_PREFIX + "*");
		List<Category> list = valueOps.multiGet(keys);
		return list; 
	}
	
	public Category findById(String id) {
		Category category = valueOps.get(CATEGORY_PREFIX + id);
		return category;
	}
}
