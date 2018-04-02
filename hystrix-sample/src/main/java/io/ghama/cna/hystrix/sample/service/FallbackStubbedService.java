package io.ghama.cna.hystrix.sample.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

import io.ghama.cna.hystrix.sample.model.Product;

@Service
public class FallbackStubbedService {

	private static Logger logger = LoggerFactory.getLogger(FallbackStubbedService.class);

	@Autowired
	private RestTemplate restTemplate;

	@HystrixCommand(fallbackMethod = "stubbedFallback")
	public Product getProduct(String productId) { 
		logger.info("Call getProduct with Hystrix protection");

		String url = "http://catalog-service/v1/products/" + productId;
		return restTemplate.getForObject(url, Product.class);
	}

	public Product stubbedFallback(String productId, Throwable t) {
		logger.error("Using stubbed fallback method for catalog-service", t);
		return new Product("stubbedFallback", productId, 0.0, false);
	}	

}
