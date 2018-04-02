package io.ghama.contents.content.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.contents.content.service.ContentsService;
import io.ghama.contents.content.vo.Content;
import io.ghama.contents.content.vo.Episode;
import io.ghama.contents.content.vo.Season;
import io.ghama.contents.content.vo.Trailer;

@RestController
@RequestMapping("/v1")
public class ContentsRestController {
	
	@Autowired
	private ContentsService contentsService;
	
	@RequestMapping(path="/contents", method=RequestMethod.GET, name="getContents")
	public List<Content> getContents(@RequestParam(value = "category") String category) {
		return contentsService.getContents(category);
	}

	@RequestMapping(path="/contents/search", method=RequestMethod.GET, name="searchContents")
	public List<Content> searchContents(@RequestParam(value = "title") String title) {
		return contentsService.searchContents(title);
	}

	@RequestMapping(path = "/contents/{id}", method = RequestMethod.GET, name = "getContentsDetail")
	public Content getContentsDetail(@PathVariable(value = "id") String id) {
		Content content = contentsService.getContentsDetail(id);
		return content;
	}
	
	@RequestMapping(path="/contents/{content}/episodes", method=RequestMethod.GET, name="getAllEpisodes")
	public List<Season> getAllEpisodes(@PathVariable(value = "content") String content) {
		return contentsService.getAllEpisodes(content);
	}
	
	@RequestMapping(path="/contents/{content}/{season}", method=RequestMethod.GET)
	public List<Episode> getSeason(@PathVariable(value = "content") String content, @PathVariable(value = "season") int season) {
		return contentsService.getSeason(content, season);
	}

	@RequestMapping(path="/contents/{content}/{season}/{episode}", method=RequestMethod.GET, name="getEpisodeDetail")
	public Episode getEpisodeDetail(@PathVariable(value = "content") String content, @PathVariable(value = "season") int season, @PathVariable(value = "episode") int episode) {
		return contentsService.getEpisodeDetail(content, season, episode);
	}

	@RequestMapping(path="/contents/{content}/trailers", method=RequestMethod.GET, name="getContentsTrailers")
	public List<Trailer> getContentsTrailers(@PathVariable(value = "content") String content) {
		return contentsService.getContentsTrailers(content);
	}
	
}
