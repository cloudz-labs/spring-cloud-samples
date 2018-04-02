package com.skcc.bff.contents.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.skcc.bff.contents.vo.Season;

@Repository("episodeDAO")
public class EpisodeDAO {

	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.contents-service}")
	private String serviceUrl;
	
	public List<Season> getAllEpisodes(String content) {
        return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/contents/%s/episodes", serviceUrl, content), Season[].class));
    }
	
}
