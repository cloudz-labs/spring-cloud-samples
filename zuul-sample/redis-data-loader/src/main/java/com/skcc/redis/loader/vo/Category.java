package com.skcc.redis.loader.vo;

import java.io.Serializable;

public class Category implements Serializable {
	
	private static final long serialVersionUID = 5683203217442640288L;

	private String id;
	
	private String name;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Category [id:"+ id +", name:"+ name +"]";
	}
}
