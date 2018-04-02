package io.ghama.recommendation.promotion.dao;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import io.ghama.recommendation.promotion.vo.Promotion;

@Repository
@RefreshScope
public class PromotionRepository {

	private final static String PROMOTION_PREFIX = "promotion:";
	
	@Autowired
	@Qualifier("promotionRedisTemplate")
	private RedisTemplate<String, Promotion> redisTemplate;
	
	@Resource(name = "promotionRedisTemplate")
	private ValueOperations<String, Promotion> valueOps;

	public Promotion findByCategoryId(String categoryId) {
		Promotion promotion = valueOps.get(PROMOTION_PREFIX + categoryId);
		return promotion; 
	}
}
