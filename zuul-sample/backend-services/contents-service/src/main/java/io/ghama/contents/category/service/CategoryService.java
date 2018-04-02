package io.ghama.contents.category.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.contents.category.dao.CategoryRepository;
import io.ghama.contents.category.vo.Category;

@Service("categoryService")
public class CategoryService {
	
	@Autowired
	private CategoryRepository categoryRepository;

	public List<Category> getCategories() {
		List<Category> categories = categoryRepository.findAll();
		return categories;
	}
	
	public Category getCategory(String id) {
		Category category = categoryRepository.findById(id);
		return category;
	}
	
}
