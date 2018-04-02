package com.skcc.redis.loader.vo;

import java.io.Serializable;

public class Episode implements Serializable {
	
	private static final long serialVersionUID = -255992261275777379L;
	
	private String content;
	private String season;
	private String episode;
	private String title;
	private String summary;
	private String runtime;
	private String video;
	private String regDate;
	private String poster;
	
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regDate) {
		this.regDate = regDate;
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
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public int getRuntime() {
		if (runtime == null || runtime.isEmpty()) 
			return 0;
		else
			return Integer.parseInt(runtime);
	}
	public void setRuntime(String runtime) {
		this.runtime = runtime;
	}
	public String getVideo() {
		return video;
	}
	public void setVideo(String video) {
		this.video = video;
	}
	public String getPoster() {
		return poster;
	}
	public void setPoster(String poster) {
		this.poster = poster;
	}
	
	@Override
	public String toString() {
		return "Episode [content=" + content + ", season=" + season + ", episode=" + episode + ", title=" + title
				+ ", summary=" + summary + ", runtime=" + runtime + ", video=" + video + ", regDate=" + regDate
				+ ", poster=" + poster + "]";
	}
}
