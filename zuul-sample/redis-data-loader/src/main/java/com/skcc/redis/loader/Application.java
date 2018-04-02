package com.skcc.redis.loader;

import java.io.File;
import java.io.FileReader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.RedisTemplate;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.skcc.redis.loader.vo.Account;
import com.skcc.redis.loader.vo.Category;
import com.skcc.redis.loader.vo.Content;
import com.skcc.redis.loader.vo.Episode;
import com.skcc.redis.loader.vo.Favorite;
import com.skcc.redis.loader.vo.History;
import com.skcc.redis.loader.vo.Notification;
import com.skcc.redis.loader.vo.Profile;
import com.skcc.redis.loader.vo.Promotion;
import com.skcc.redis.loader.vo.Trailer;

@SpringBootApplication
public class Application implements CommandLineRunner {
	
	@Value(value = "classpath:json")
	private Resource resourceFolder;
	
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;
	
	@Override
	public void run(String... arg0) throws Exception {
		File jsonFolder = resourceFolder.getFile();
		Gson gson = new Gson();
		
		//account
		redisTemplate.delete(redisTemplate.keys("account:*"));
		TypeToken<List<Account>> accoutToken = new TypeToken<List<Account>>(){};
		List<Account> accounts = gson.fromJson(new FileReader(new File(jsonFolder, "account.json")), accoutToken.getType());
		accounts.forEach(account -> {
			redisTemplate.opsForSet().add("account:" + account.getUsername(), account);
			System.out.println(account);
		});
		
		//profile
		redisTemplate.delete(redisTemplate.keys("profile:*"));
		TypeToken<List<Profile>>profileToken = new TypeToken<List<Profile>>(){};
		List<Profile> profiles = gson.fromJson(new FileReader(new File(jsonFolder, "profile.json")), profileToken.getType());
		profiles.forEach(profile -> {
			redisTemplate.opsForSet().add("profile:" + profile.getUsername(), profile);
			System.out.println(profile);
		});
		
		//favorite
		redisTemplate.delete(redisTemplate.keys("favorite:*"));
		TypeToken<List<Favorite>> favoriteToken = new TypeToken<List<Favorite>>(){};
		List<Favorite> favorites = gson.fromJson(new FileReader(new File(jsonFolder, "favorite.json")), favoriteToken.getType());
		favorites.forEach(favorite -> {
			redisTemplate.opsForSet().add("favorite:" + favorite.getUsername() + ":" + favorite.getProfile(), favorite);
			System.out.println(favorite);
		});
		
		//history
		redisTemplate.delete(redisTemplate.keys("history:*"));
		TypeToken<List<History>> historyToken = new TypeToken<List<History>>(){};
		List<History> histories = gson.fromJson(new FileReader(new File(jsonFolder, "history.json")), historyToken.getType());
		histories.forEach(history -> {
			redisTemplate.opsForSet().add("history:" + history.getUsername() + ":" + history.getProfile(), history);
			System.out.println(history);
		});

		//category
		redisTemplate.delete(redisTemplate.keys("category:*"));
		TypeToken<List<Category>> categoryToken = new TypeToken<List<Category>>(){};
		List<Category> categories = gson.fromJson(new FileReader(new File(jsonFolder, "category.json")), categoryToken.getType());
		categories.forEach(category -> {
			redisTemplate.opsForValue().set("category:" + category.getId(), category);
			System.out.println(category);
		});
		
		//content
		redisTemplate.delete(redisTemplate.keys("content:*"));
		TypeToken<List<Content>> contentToken = new TypeToken<List<Content>>(){};
		List<Content> contents = gson.fromJson(new FileReader(new File(jsonFolder, "content.json")), contentToken.getType());
		contents.forEach(content -> {
			redisTemplate.opsForValue().set("content:" + content.getId() + ":" + content.getTitle() + ":" + content.getCategory(), content);
			System.out.println(content);
		});

		//episode
		redisTemplate.delete(redisTemplate.keys("episode:*"));
		TypeToken<List<Episode>> episodeTeoken = new TypeToken<List<Episode>>(){};
		List<Episode> episodes = gson.fromJson(new FileReader(new File(jsonFolder, "episode.json")), episodeTeoken.getType());
		episodes.forEach(episode -> {
			redisTemplate.opsForValue().set("episode:" + episode.getContent() + ":" + episode.getSeason() + ":" + episode.getEpisode(), episode);
			System.out.println(episode);
		});

		//trailer
		redisTemplate.delete(redisTemplate.keys("trailer:*"));
		TypeToken<List<Trailer>> trailerToken = new TypeToken<List<Trailer>>(){};
		List<Trailer> trailers = gson.fromJson(new FileReader(new File(jsonFolder, "trailer.json")), trailerToken.getType());
		trailers.forEach(trailer -> {
			redisTemplate.opsForList().rightPush("trailer:" + trailer.getContent(), trailer);
			System.out.println(trailer);
		});
		
		//Notification 
		redisTemplate.delete(redisTemplate.keys("notification:*"));
		TypeToken<List<Notification>> notificationToken = new TypeToken<List<Notification>>(){};
		List<Notification> notifications = gson.fromJson(new FileReader(new File(jsonFolder, "notification.json")), notificationToken.getType());
		notifications.forEach(notification -> {
			redisTemplate.opsForSet().add("notification:" + notification.getNotiDate(), notification);
			System.out.println(notification);
		});

		//Promotion
		redisTemplate.delete(redisTemplate.keys("promotion:*"));
		TypeToken<List<Promotion>> promotionToken = new TypeToken<List<Promotion>>(){};
		List<Promotion> promotions = gson.fromJson(new FileReader(new File(jsonFolder, "promotion.json")), promotionToken.getType());
		promotions.forEach(promotion -> {
			redisTemplate.opsForValue().set("promotion:" + promotion.getCategory(), promotion);
			System.out.println(promotion);
		});
		
	}
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
