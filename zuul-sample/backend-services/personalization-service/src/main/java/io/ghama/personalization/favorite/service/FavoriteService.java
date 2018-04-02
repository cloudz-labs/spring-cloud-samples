package io.ghama.personalization.favorite.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import io.ghama.personalization.contents.vo.Content;
import io.ghama.personalization.favorite.dao.FavoriteRepository;
import io.ghama.personalization.favorite.vo.Favorite;

@Service("favoriteService")
public class FavoriteService {
	
	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private FavoriteRepository favoriteRepository;
	
	public List<Content> getFavorites(String username, String profile) {
		List<Content> contents = new ArrayList<Content>();
		
		List<Favorite> favorites = favoriteRepository.findByUsername(username, profile);
		favorites.forEach(favorite -> {
			Content content = restTemplate.getForObject("http://contents-service/v1/contents/{content}", Content.class, favorite.getContent());
			contents.add(content);
		});
		return contents;
	}
	
}
