package io.ghama.bff.favorite.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.favorite.service.FavoriteService;

@RestController
@RequestMapping("/v1")
public class FavoriteController {

	@Autowired
	private FavoriteService favoriteService;
	
	@RequestMapping(path="/favorites", method=RequestMethod.GET, name="getFavorites")
	public List<Content> getFavorites(HttpServletRequest request) {
		
		HttpSession session = request.getSession();
		String username = session.getAttribute("username").toString();
		String profile = session.getAttribute("profile").toString();
		
		List<Content> favorites = favoriteService.getFavorites(username, profile); 
		return favorites;
	}

}
