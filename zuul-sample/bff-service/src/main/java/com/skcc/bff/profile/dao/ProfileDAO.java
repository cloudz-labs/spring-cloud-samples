package com.skcc.bff.profile.dao;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.skcc.bff.profile.vo.Profile;

@Repository("profileDAO")
public class ProfileDAO {
	
	@Autowired
	private RestTemplate restTemplate;
	
	@Value("${api.services.account-service}")
	private String serviceUrl;
	
	public List<Profile> getProfiles(String username) {
		return Arrays.asList(restTemplate.getForObject(String.format("%s/v1/%s/profiles", serviceUrl, username), Profile[].class));
    }
	
}
