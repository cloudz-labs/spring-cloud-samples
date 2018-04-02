package io.ghama.redis.loader.vo;

import java.io.Serializable;

public class Notification implements Serializable {
	
	private static final long serialVersionUID = 1976541387734769808L;
	
	private int id;
	private int content;
	private String notiDate;
	private String profile;
	
	public String getId() {
		return Integer.toString(id);
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getContent() {
		return Integer.toString(content);
	}

	public void setContent(int content) {
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
		return "Notification [id:"+ id + ", content:"+ content + ", notiDate:"+ notiDate + ", profile:"+ profile+"]";
	}
}
