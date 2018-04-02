package com.skcc.bff.promotion.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.skcc.bff.contents.vo.Content;

@Repository("promotionDAO")
public class PromotionDAO {
	
	@Autowired
	private RestTemplate restTemplate;

	@Value("${api.services.recommendation-service}")
	private String serviceUrl;
	
	public Content getPromotion() {
		return restTemplate.getForObject(String.format("%s/v1/promotions", serviceUrl), Content.class);
    }
	
}
