package io.ghama.bff.notification.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Notification {
	
	private String id;
	
	private String content;
	
	private String notiDate;

	private String profile;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getNotiDate() {
		return notiDate;
	}

	public void setNotiDate(String notiDate) {
		this.notiDate = notiDate;
	}
	
	public String getProfile() {
		return profile;
	}

	public void setProfile(String profile) {
		this.profile = profile;
	}

	@Override
	public String toString() {
		return "Notification [id:"+ id + ", content:"+ content + ", notiDate:"+ notiDate + ", profile:"+ profile + "]";
	}
}