package io.ghama.recommendation.promotion.vo;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Promotion implements Serializable {
	
	private static final long serialVersionUID = 1976541387734769808L;
	
	private String category;
	
	private String content;
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Override
	public String toString() {
		return "Notification [category:"+ category + ", content:"+ content +"]";
	}
}
