package com.skcc.bff.profile.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.profile.dao.ProfileDAO;
import com.skcc.bff.profile.vo.Profile;

@Service("profileService")
public class ProfileService {
	
	@Autowired
	private ProfileDAO profileDAO;
	
	public List<Profile> getProfiles(String username) {
		List<Profile> profiles = profileDAO.getProfiles(username);
		return profiles;
	}
	
}
