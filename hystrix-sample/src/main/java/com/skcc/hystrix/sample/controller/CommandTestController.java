package com.skcc.hystrix.sample.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skcc.hystrix.sample.model.Product;
import com.skcc.hystrix.sample.service.FailSilentService;
import com.skcc.hystrix.sample.service.FallbackStubbedService;
import com.skcc.hystrix.sample.service.FallbackViaNetworkService;
import com.skcc.hystrix.sample.service.RequestCacheInvalidationService;

@RestController
public class CommandTestController {

	private static Logger logger = LoggerFactory.getLogger(CommandTestController.class);
	
	@Autowired
	private FailSilentService failSilentService;
	
	@Autowired
	private FallbackStubbedService fallbackStubbedService;
	
	@Autowired
	private FallbackViaNetworkService fallbackViaNetworkService;

	@Autowired
	private RequestCacheInvalidationService requestCacheInvalidationService;
	
	@RequestMapping("/failSilent")
	public ResponseEntity<Product> getProductForFailSilent() {
		String productId = "SKU-12464";
		Product product = failSilentService.getProduct(productId);		
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@RequestMapping("/fallbackStubbed")
	public ResponseEntity<Product> getProductForStubbedFallback() {
		String productId = "SKU-12464";
		Product product = fallbackStubbedService.getProduct(productId);		
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@RequestMapping("/fallbackViaNetwork")
	public ResponseEntity<Product> getProductForNetwork() {
		String productId = "SKU-12464";
		Product product = fallbackViaNetworkService.getProduct(productId);		
		return new ResponseEntity<>(product, HttpStatus.OK);
	}

	@RequestMapping("/requestCache")
	public ResponseEntity<Product> getProductFromCache() {
		String productId = "SKU-12464";
		
		logger.info("Call requestCacheInvalidationService.getProduct - first. call remote service?");
		Product product = requestCacheInvalidationService.getProduct(productId);
		
		logger.info("Call requestCacheInvalidationService.getProduct - second. use cache?");
		product = requestCacheInvalidationService.getProduct(productId);
		
		logger.info("Call requestCacheInvalidationService.updateProduct");
		product = requestCacheInvalidationService.updateProduct(product);

		logger.info("Call requestCacheInvalidationService.getProduct - third. call remote service?");
		product = requestCacheInvalidationService.getProduct(productId);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}

}
