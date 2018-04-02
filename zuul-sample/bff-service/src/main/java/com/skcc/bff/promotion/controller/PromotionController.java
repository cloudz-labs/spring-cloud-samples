package com.skcc.bff.promotion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.promotion.service.PromotionService;

@RestController
@RequestMapping("/v1")
public class PromotionController {
	
	@Autowired
	private PromotionService promotionService;
 
	@RequestMapping(path="/promotions", method=RequestMethod.GET, name="getPromotion")
	public Content getPromotions() {
		Content promotion = promotionService.getPromotion();
		return promotion;
	}
}
