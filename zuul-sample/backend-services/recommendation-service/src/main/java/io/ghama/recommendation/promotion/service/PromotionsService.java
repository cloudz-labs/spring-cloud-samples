package io.ghama.recommendation.promotion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import io.ghama.recommendation.contents.vo.Content;
import io.ghama.recommendation.promotion.dao.PromotionRepository;
import io.ghama.recommendation.promotion.vo.Promotion;

@Service("promotionsService")
public class PromotionsService {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private PromotionRepository promotionRepository;
	
	public Content getPromotion() {
		String categoryId = "tv";
		
		Promotion promotion = promotionRepository.findByCategoryId(categoryId);
		return restTemplate.getForObject("http://contents-service/v1/contents/{content_id}", Content.class, promotion.getContent());
	}
	
}
