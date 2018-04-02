package com.skcc.bff.category.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skcc.bff.category.dao.CategoryDAO;
import com.skcc.bff.category.vo.Category;

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
