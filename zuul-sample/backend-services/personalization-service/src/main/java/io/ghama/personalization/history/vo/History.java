package io.ghama.personalization.history.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class History implements Serializable {

	private static final long serialVersionUID = -6342743240188279296L;
	
	private String username;
	
	private String profile;
	
	private String content;
	
	private int season;
	
	private int episode;
	
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
		return season;
	}

	public void setSeason(int season) {
		this.season = season;
	}

	public int getEpisode() {
		return episode;
	}

	public void setEpisode(int episode) {
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
		return "History [username=" + username + ", profile=" + profile + ", content=" + content + ", season=" + season
				+ ", episode=" + episode + ", grade=" + grade + ", date=" + date + "]";
	}
	
}
