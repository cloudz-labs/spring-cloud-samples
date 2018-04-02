package com.skcc.redis.loader.vo;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;

public class Content implements Serializable {

	private static final long serialVersionUID = -3065118815746014253L;
	
	private String id;
	private String category;
	private String title;
	private String grade;
	private String poster;
	private String director;
	private String producer;
	private String actor;
	private String genre;
	private String feature;
	private String rate;
	private String voice;
	private String subtitle;
	private String year;
	private String summary;
	private String video;
	private String runtime;
	private String hasEpisodes;
	private String hasTrailers;
	private String view;
	private String regDate;
	private String stillcut;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public double getGrade() {
		return Double.parseDouble(grade);
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}
	public String getPoster() {
		return poster;
	}
	public void setPoster(String poster) {
		this.poster = poster;
	}
	public List<String> getDirector() {
		if(director != null && !director.isEmpty()) {
			return Arrays.asList(director.split("\n"));
		}
		return null;
	}
	public void setDirector(String director) {
		this.director = director;
	}
	public List<String> getProducer() {
		if(producer != null && !producer.isEmpty()) {
			return Arrays.asList(producer.split("\n"));
		}
		return null;
	}
	public void setProducer(String producer) {
		this.producer = producer;
	}
	public List<String> getActor() {
		if(actor != null && !actor.isEmpty()) {
			return Arrays.asList(actor.split("\n"));
		}
		return null;
	}
	public void setActor(String actor) {
		this.actor = actor;
	}
	public List<String> getGenre() {
		if(genre != null && !genre.isEmpty()) {
			return Arrays.asList(genre.split("\n"));
		}
		return null;
	}
	public void setGenre(String genre) {
		this.genre = genre;
	}
	public List<String> getFeature() {
		if(feature != null && !feature.isEmpty()) {
			return Arrays.asList(feature.split("\n"));
		}
		return null;
	}
	public void setFeature(String feature) {
		this.feature = feature;
	}
	public String getRate() {
		return rate;
	}
	public void setRate(String rate) {
		this.rate = rate;
	}
	public List<String> getVoice() {
		if(voice != null && !voice.isEmpty()) {
			return Arrays.asList(voice.split("\n"));
		}
		return null;
	}
	public void setVoice(String voice) {
		this.voice = voice;
	}
	public List<String> getSubtitle() {
		if(subtitle != null && !subtitle.isEmpty()) {
			return Arrays.asList(subtitle.split("\n"));
		}
		return null;
	}
	public void setSubtitle(String subtitle) {
		this.subtitle = subtitle;
	}
	public int getYear() {
		if (year == null || year.isEmpty()) 
			return 0;
		else
			return Integer.parseInt(year);
	}
	public void setYear(String year) {
		this.year = year;
	}
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	public String getVideo() {
		return video;
	}
	public void setVideo(String video) {
		this.video = video;
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
	public boolean isHasEpisodes() {
		return Boolean.parseBoolean(hasEpisodes);
	}
	public void setHasEpisodes(String hasEpisodes) {
		this.hasEpisodes = hasEpisodes;
	}
	public boolean isHasTrailers() {
		return Boolean.parseBoolean(hasTrailers);
	}
	public void setHasTrailers(String hasTrailers) {
		this.hasTrailers = hasTrailers;
	}
	public int getView() {
		if (view == null || view.isEmpty()) 
			return 0;
		else
			return Integer.parseInt(view);
	}
	public void setView(String view) {
		this.view = view;
	}
	public String getRegDate() {
		return regDate;
	}
	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}
	public String getStillcut() {
		return stillcut;
	}
	public void setStillcut(String stillcut) {
		this.stillcut = stillcut;
	}
	@Override
	public String toString() {
		return "Content [id=" + id + ", category=" + category + ", title=" + title + ", grade=" + grade + ", poster="
				+ poster + ", director=" + director + ", producer=" + producer + ", actor=" + actor + ", genre=" + genre
				+ ", feature=" + feature + ", rate=" + rate + ", voice=" + voice + ", subtitle=" + subtitle + ", year="
				+ year + ", summary=" + summary + ", video=" + video + ", runtime=" + runtime + ", hasEpisodes="
				+ hasEpisodes + ", hasTrailers=" + hasTrailers + ", view=" + view + ", regDate=" + regDate
				+ ", stillcut=" + stillcut + "]";
	}
	
}
