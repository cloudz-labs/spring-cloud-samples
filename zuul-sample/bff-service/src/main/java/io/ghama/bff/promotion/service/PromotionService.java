package io.ghama.bff.promotion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.promotion.dao.PromotionDAO;

@Service("promotionService")
public class PromotionService {
	
	@Autowired
	private PromotionDAO promotionDAO;
	
	public Content getPromotion() {
		Content promotion = promotionDAO.getPromotion();
		return promotion;
	}
	
}
