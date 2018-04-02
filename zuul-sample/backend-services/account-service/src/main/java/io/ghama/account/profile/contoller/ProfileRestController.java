package io.ghama.account.profile.contoller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.account.profile.service.ProfileService;
import io.ghama.account.profile.vo.Profile;

@RestController
@RequestMapping("/v1")
public class ProfileRestController {
	
	@Autowired
	private ProfileService profileService;
	
	@RequestMapping(path="/{username}/profiles", method=RequestMethod.GET, name="getProfiles")
	public List<Profile> getProfiles(@PathVariable(value = "username") String username) {
		List<Profile> profiles = profileService.getProfiles(username); 
		return profiles;
	}

}
