package io.ghama.account.profile.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.account.profile.dao.ProfileRepository;
import io.ghama.account.profile.vo.Profile;

@Service("profileService")
public class ProfileService {
	
	@Autowired
	private ProfileRepository profileRepository;
	
	public List<Profile> getProfiles(String username) {
		List<Profile> profiles = profileRepository.findByUsername(username);
		return profiles;
	}
	
}
