package io.ghama.contents.content.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.contents.content.dao.ContentsRepository;
import io.ghama.contents.content.dao.EpisodeRepository;
import io.ghama.contents.content.dao.TrailerRepository;
import io.ghama.contents.content.vo.Content;
import io.ghama.contents.content.vo.Episode;
import io.ghama.contents.content.vo.Season;
import io.ghama.contents.content.vo.Trailer;

@Service("contentsService")
public class ContentsService {
	
	@Autowired
	private ContentsRepository contentsRepository;
	
	@Autowired
	private EpisodeRepository episodeRepository;
	
	@Autowired
	private TrailerRepository trailerRepository;
	
	public List<Content> getContents(String category) {
		return contentsRepository.findByCategory(category);
	}
	
	public List<Content> searchContents(String title) {
		return contentsRepository.findByTitle(title);
	}

	public Content getContentsDetail(String id) {
		return contentsRepository.findById(id);
	}

	public List<Season> getAllEpisodes(String content) {
		List<Season> allEpisodes = new ArrayList<Season>();
		
		List<Integer> seasons = episodeRepository.findSeasonsByContent(content);
		seasons.forEach(seasonIndex -> {
			Season season = new Season();
			season.setSeason(seasonIndex);
			season.setEpisodes(episodeRepository.findByContentAndSeason(content, seasonIndex));
			allEpisodes.add(season);
		});
		
		return allEpisodes;
	}
	
	public List<Episode> getSeason(String content, int season) {
		return episodeRepository.findByContentAndSeason(content, season);
	}
	
	public Episode getEpisodeDetail(String content, int season, int episode) {
		return episodeRepository.findOne(content, season, episode);
	}

	public List<Trailer> getContentsTrailers(String content) {
		return trailerRepository.findByContent(content);
	}
	
}
