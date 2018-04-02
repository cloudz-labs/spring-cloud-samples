package io.ghama.bff.category.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.ghama.bff.category.dao.CategoryDAO;
import io.ghama.bff.category.vo.Category;

@Service("categoryService")
public class CategoryService {
	
	@Autowired
	private CategoryDAO categoryDAO;

	public List<Category> getCategoryList () {
		List<Category> categories = categoryDAO.getCategoryList();
		return categories;
	}
	
	public Category getCategory(String id) {
		Category category = categoryDAO.getCategory(id);
		return category;
	}
	
}
