package io.ghama.bff.category.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import io.ghama.bff.category.vo.Category;

@Repository("categoryDAO")
public class CategoryDAO {

	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.contents-service}")
	private String serviceUrl;
	
	public List<Category> getCategoryList() {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/categories", serviceUrl), Category[].class));
    }
	
	public Category getCategory(String id) {
		return restTemplate.getForObject(String.format("%s/v1/categories/%s", serviceUrl, id), Category.class);
    }
	
}