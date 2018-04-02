package io.ghama.cna.hystrix.sample.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.cache.annotation.CacheKey;
import com.netflix.hystrix.contrib.javanica.cache.annotation.CacheRemove;
import com.netflix.hystrix.contrib.javanica.cache.annotation.CacheResult;

import io.ghama.cna.hystrix.sample.model.Product;

@Service
public class RequestCacheInvalidationService {

	private static Logger logger = LoggerFactory.getLogger(RequestCacheInvalidationService.class);
	
	@Autowired
	private RestTemplate restTemplate;
	
	@CacheResult
	@HystrixCommand
	public Product getProduct(@CacheKey String productId) { 
		logger.info("Call getProduct with Hystrix protection");
		
		String url = "http://catalog-service.ghama.io/v1/products/" + productId;
		return restTemplate.getForObject(url, Product.class);
	}
	
	@CacheRemove(commandKey = "getProduct")
	@HystrixCommand
	public Product updateProduct(@CacheKey("productId") Product product) {
		logger.info("Call updateProduct with Hystrix protection");
		
		String url = "http://catalog-service.ghama.io/v1/products/" + product.getProductId();
		return restTemplate.getForObject(url, Product.class);
	}
}
