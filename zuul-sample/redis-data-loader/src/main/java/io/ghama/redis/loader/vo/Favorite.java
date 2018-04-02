package io.ghama.redis.loader.vo;

import java.io.Serializable;

public class Favorite implements Serializable {
	
	private static final long serialVersionUID = -7093182224757433586L;
	
	private String username;
	
	private String profile;
	
	private String content;
	
	private String season;
	
	private String episode;
	
	private double grade;
	
	private String date;
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getProfile() {
		return profile;
	}
	
	public void setProfile(String profile) {
		this.profile = profile;
	}
	
	public String getContent() {
		return content;
	}
	
	public void setContent(String content) {
		this.content = content;
	}
	
	public int getSeason() {
		if (season == null || season.isEmpty()) 
			return 0;
		else
			return Integer.parseInt(season);
	}
	
	public void setSeason(String season) {
		this.season = season;
	}
	
	public int getEpisode() {
		if (episode == null || episode.isEmpty()) 
			return 0;
		else
			return Integer.parseInt(episode);
	}
	
	public void setEpisode(String episode) {
		this.episode = episode;
	}
	
	public double getGrade() {
		return grade;
	}
	
	public void setGrade(double grade) {
		this.grade = grade;
	}
	
	public String getDate() {
		return date;
	}
	
	public void setDate(String date) {
		this.date = date;
	}
	
	@Override
	public String toString() {
		return "Favorite [username:"+ username +", profile:"+ profile +", content:"+ content +", season:"+ season +", episode:"+ episode +", grade:"+ grade +", date:"+ date +"]";
	}
}
