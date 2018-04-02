package io.ghama.bff.contents.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.contents.dao.ContentsDAO;
import io.ghama.bff.contents.dao.EpisodeDAO;
import io.ghama.bff.contents.dao.TrailerDAO;
import io.ghama.bff.contents.vo.Content;
import io.ghama.bff.contents.vo.Season;
import io.ghama.bff.contents.vo.Trailer;

@Service("contentsService")
public class ContentsService {
	
	@Autowired
	private ContentsDAO contentsDAO;
	
	@Autowired
	private EpisodeDAO episodeDAO;
	
	@Autowired
	private TrailerDAO trailerDAO;

	public List<Content> getContentsByCategory(String category) {
		List<Content> contents = contentsDAO.getContentsByCategory(category);
		return contents;
	}
	
	public List<Content> getContentsByTitle(String title) {
		List<Content> contents = contentsDAO.getContentsByTitle(title);
		return contents;
	}
	
	public Content getContentsDetail(String id) {
		Content content = contentsDAO.getContentsDetail(id);
		return content;
	}
	
	public List<Season> getAllEpisodes(String id) {
		List<Season> seasons = episodeDAO.getAllEpisodes(id);
		return seasons;
	}
	
	public List<Trailer> getTrailers(String id) {
		List<Trailer> trailers = trailerDAO.getTrailers(id);
		return trailers;
	}
	
	public List<Content> getSmiliars(String id, String category) {
		Content content = this.getContentsDetail(id);
		List<Content> similars = new ArrayList<Content>(getContentsByCategory(category));
		similars.remove(content);
		return similars;
	}
}
