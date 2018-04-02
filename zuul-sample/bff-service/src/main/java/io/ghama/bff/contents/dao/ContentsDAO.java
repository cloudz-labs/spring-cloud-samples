package io.ghama.bff.contents.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import io.ghama.bff.contents.vo.Content;

@Repository("contentsDAO")
public class ContentsDAO {

	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.contents-service}")
	private String serviceUrl;
	
	public List<Content> getContentsByCategory(String category) {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/contents?category=%s", serviceUrl, category), Content[].class));
    }
	
	public List<Content> getContentsByTitle(String title) {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/contents/search?title=%s", serviceUrl, title), Content[].class));
    }
	
	public Content getContentsDetail(String id) {
        return restTemplate.getForObject(String.format("%s/v1/contents/%s", serviceUrl, id), Content.class);
    }
	
}
