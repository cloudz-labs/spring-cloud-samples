package io.ghama.contents.content.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Episode implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private String content;
	
	private int season;
	
	private int episode;
	
	private String title;
	
	private String summary;
	
	private int runtime;
	
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
		return runtime;
	}
	
	public void setRuntime(int runtime) {
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
