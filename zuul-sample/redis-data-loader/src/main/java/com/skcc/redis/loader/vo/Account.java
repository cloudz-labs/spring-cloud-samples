package com.skcc.redis.loader.vo;

import java.io.Serializable;

public class Account implements Serializable {
	
	private static final long serialVersionUID = 6554619340907505993L;

	private String username;
	
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "Account [username=" + username + ", password=" + password + "]";
	}

}
