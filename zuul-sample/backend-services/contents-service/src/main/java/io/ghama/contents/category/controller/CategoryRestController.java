package io.ghama.contents.category.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.ghama.contents.category.service.CategoryService;
import io.ghama.contents.category.vo.Category;

@RestController
@RequestMapping("/v1")
public class CategoryRestController {
	
	@Autowired
	private CategoryService categoryService;
	
	@RequestMapping(path="/categories", method=RequestMethod.GET, name="getCategories")
	public List<Category> getCategories() throws Exception {
		List<Category> categories = categoryService.getCategories();
		return categories;
	}
	
	@RequestMapping(path="/categories/{id}", method=RequestMethod.GET, name="getCategory")
	public Category getCategory(@PathVariable(value = "id") String id) throws Exception {
		Category category = categoryService.getCategory(id);
		return category;
	}
}