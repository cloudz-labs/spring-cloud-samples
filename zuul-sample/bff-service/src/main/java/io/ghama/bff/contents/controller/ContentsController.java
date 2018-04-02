package io.ghama.bff.contents.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.bff.contents.service.ContentsService;
import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.contents.vo.Season;
import io.ghama.bff.contents.vo.Trailer;

@RestController
@RequestMapping("/v1")
public class ContentsController {

	@Autowired
	private ContentsService contentsService;
	
	@RequestMapping(path="/contents", method = RequestMethod.GET, name="getContents")
	public List<Content> getContents(@RequestParam(value = "category") String category) {
		return contentsService.getContentsByCategory(category);
	}
	
	@RequestMapping(path="/contents/search", method=RequestMethod.GET, name="searchContents")
	public List<Content> searchContents(@RequestParam(value = "title") String title) {
		return contentsService.getContentsByTitle(title);
	}
	
	@RequestMapping(path = "/contents/{id}", method = RequestMethod.GET, name="getContentsDetail")
	public Content getContentsDetail(@PathVariable(value = "id") String id) {
		return contentsService.getContentsDetail(id);
	}
	
	@RequestMapping(path="/contents/{id}/episodes", method=RequestMethod.GET, name="getAllEpisodes")
	public List<Season> getAllEpisodes(@PathVariable(value = "id") String id) {
		return contentsService.getAllEpisodes(id);
	}
	
	@RequestMapping(path="/contents/{id}/trailers", method=RequestMethod.GET, name="getTrailers")
	public List<Trailer> getTrailers(@PathVariable(value = "id") String id) {
		return contentsService.getTrailers(id);
	}
	
	@RequestMapping(path="/contents/{id}/similars", method=RequestMethod.GET, name="getSimilars")
	public List<Content> getSimilars(@PathVariable(value = "id") String id, @RequestParam(value = "category") String category) {
		return contentsService.getSmiliars(id, category);
	}

}
