package io.ghama.redis.loader.vo;

import java.io.Serializable;

public class Trailer implements Serializable {
	
	private static final long serialVersionUID = 1976541387734769808L;
	
	private String content;
	private String title;
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
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
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
		return "Trailer [content=" + content + ", title=" + title + ", video=" + video + ", regDate=" + regDate
				+ ", poster=" + poster + "]";
	}
}
