package io.ghama.bff.contents.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import io.ghama.bff.contents.vo.Trailer;

@Repository("trailerDAO")
public class TrailerDAO {

	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.contents-service}")
	private String serviceUrl;
	
	public List<Trailer> getTrailers(String content) {
        return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/contents/%s/trailers", serviceUrl, content), Trailer[].class));
    }
	
}
