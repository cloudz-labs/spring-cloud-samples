package io.ghama.bff.favorite.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import io.ghama.bff.contents.vo.Content;

@Repository("favoriteDAO")
public class FavoriteDAO {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.personalization-service}")
	private String serviceUrl;
	
	public List<Content> getFavorites(String username, String profile) {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/%s/%s/favorites", serviceUrl, username, profile), Content[].class));
    }
	
}
