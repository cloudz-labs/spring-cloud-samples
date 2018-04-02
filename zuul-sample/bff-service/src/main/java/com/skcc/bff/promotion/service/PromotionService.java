package com.skcc.bff.promotion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.promotion.dao.PromotionDAO;

@Service("promotionService")
public class PromotionService {
	
	@Autowired
	private PromotionDAO promotionDAO;
	
	public Content getPromotion() {
		Content promotion = promotionDAO.getPromotion();
		return promotion;
	}
	
}
