package com.skcc.hystrix.sample.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.skcc.hystrix.sample.model.Product;

@Service
public class FailSilentService {

	private static Logger logger = LoggerFactory.getLogger(FailSilentService.class);

	@Autowired
	private RestTemplate restTemplate;

	@HystrixCommand(fallbackMethod = "failSilentFallback")
	public Product getProduct(String productId) { 
		logger.info("Call getProduct with Hystrix protection");

		String url = "http://catalog-service/v1/products/" + productId;
		return restTemplate.getForObject(url, Product.class);
	}


	public Product failSilentFallback(String productId, Throwable t) {
		logger.error("Using fail silent fallback method for catalog-service", t);
		return null;
	}	
}
