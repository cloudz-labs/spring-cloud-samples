package com.skcc.bff.favorite.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.contents.vo.Content;
import com.skcc.bff.favorite.dao.FavoriteDAO;

@Service("favoriteService")
public class FavoriteService {
	
	@Autowired
	private FavoriteDAO favoriteDAO;
	
	public List<Content> getFavorites(String username, String profile) {
		List<Content> favorites = favoriteDAO.getFavorites(username, profile);
		return favorites;
	}
	
}
