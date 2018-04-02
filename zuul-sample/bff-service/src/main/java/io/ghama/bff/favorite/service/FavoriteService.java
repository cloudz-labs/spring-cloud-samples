package io.ghama.bff.favorite.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.favorite.dao.FavoriteDAO;

@Service("favoriteService")
public class FavoriteService {
	
	@Autowired
	private FavoriteDAO favoriteDAO;
	
	public List<Content> getFavorites(String username, String profile) {
		List<Content> favorites = favoriteDAO.getFavorites(username, profile);
		return favorites;
	}
	
}
