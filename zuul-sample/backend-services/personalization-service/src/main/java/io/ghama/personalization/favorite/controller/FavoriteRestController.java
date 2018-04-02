package io.ghama.personalization.favorite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.personalization.contents.vo.Content;
import io.ghama.personalization.favorite.service.FavoriteService;

@RestController
@RequestMapping("/v1")
public class FavoriteRestController {
	
	@Autowired
	private FavoriteService favoriteService;
	
	@RequestMapping(path="/{username}/{profile}/favorites", method=RequestMethod.GET, name="getFavorites")
	public List<Content> getFavorites(@PathVariable(value = "username") String username, @PathVariable(value = "profile") String profile) {
		List<Content> favorites = favoriteService.getFavorites(username, profile); 
		return favorites;
	}

}
