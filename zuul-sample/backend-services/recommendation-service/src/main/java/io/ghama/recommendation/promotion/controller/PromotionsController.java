package io.ghama.recommendation.promotion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.recommendation.contents.vo.Content;
import io.ghama.recommendation.promotion.service.PromotionsService;

@RestController
@RequestMapping("/v1")
public class PromotionsController {
	
	@Autowired
	private PromotionsService promotionsService;
	
	@RequestMapping(path="/promotions", method=RequestMethod.GET, name="getPromotions")
	public Content getPromotions() throws Exception {
		Content promotion = promotionsService.getPromotion();
		return promotion;
	}
}
