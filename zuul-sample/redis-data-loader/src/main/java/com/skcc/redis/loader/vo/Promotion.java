package com.skcc.redis.loader.vo;

import java.io.Serializable;

public class Promotion implements Serializable {
	
	private static final long serialVersionUID = 1976541387734769808L;
	
	private String category;
	private int content;
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getContent() {
		return Integer.toString(content);
	}

	public void setContent(int content) {
		this.content = content;
	}

	@Override
	public String toString() {
		return "Promotion [category:"+ category + ", content:"+ content +"]";
	}
}
