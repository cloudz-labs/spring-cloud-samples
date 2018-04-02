package io.ghama.bff.contents.vo;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Content {
	
	private String id;
	
	private String category;
	
	private String title;
	
	private double grade;
	
	private String poster;
	
	private List<String> director;
	
	private List<String> producer;
	
	private List<String> actor;
	
	private List<String> genre;
	
	private List<String> feature;
	
	private String rate;
	
	private List<String> voice;
	
	private List<String> subtitle;
	
	private int year;
	
	private String summary;
	
	private String video;
	
	private int runtime;
	
	private boolean hasEpisodes;
	
	private boolean hasTrailers;
	
	private int view;
	
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
		return grade;
	}
	
	public void setGrade(double grade) {
		this.grade = grade;
	}
	
	public String getPoster() {
		return poster;
	}
	
	public void setPoster(String poster) {
		this.poster = poster;
	}
	
	public List<String> getDirector() {
		return director;
	}
	
	public void setDirector(List<String> director) {
		this.director = director;
	}
	
	public List<String> getProducer() {
		return producer;
	}
	
	public void setProducer(List<String> producer) {
		this.producer = producer;
	}
	
	public List<String> getActor() {
		return actor;
	}
	
	public void setActor(List<String> actor) {
		this.actor = actor;
	}
	
	public List<String> getGenre() {
		return genre;
	}
	
	public void setGenre(List<String> genre) {
		this.genre = genre;
	}
	
	public List<String> getFeature() {
		return feature;
	}
	
	public void setFeature(List<String> feature) {
		this.feature = feature;
	}
	
	public String getRate() {
		return rate;
	}
	
	public void setRate(String rate) {
		this.rate = rate;
	}
	
	public List<String> getVoice() {
		return voice;
	}
	
	public void setVoice(List<String> voice) {
		this.voice = voice;
	}
	
	public List<String> getSubtitle() {
		return subtitle;
	}
	
	public void setSubtitle(List<String> subtitle) {
		this.subtitle = subtitle;
	}
	
	public int getYear() {
		return year;
	}
	
	public void setYear(int year) {
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
		return runtime;
	}
	
	public void setRuntime(int runtime) {
		this.runtime = runtime;
	}
	
	public boolean isHasEpisodes() {
		return hasEpisodes;
	}
	
	public void setHasEpisodes(boolean hasEpisodes) {
		this.hasEpisodes = hasEpisodes;
	}
	
	public boolean isHasTrailers() {
		return hasTrailers;
	}
	
	public void setHasTrailers(boolean hasTrailers) {
		this.hasTrailers = hasTrailers;
	}

	public int getView() {
		return view;
	}
	
	public void setView(int view) {
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Content other = (Content) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

}
