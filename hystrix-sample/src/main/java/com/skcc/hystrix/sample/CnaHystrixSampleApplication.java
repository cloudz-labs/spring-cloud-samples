package com.skcc.hystrix.sample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;

@SpringBootApplication
@EnableHystrix
public class CnaHystrixSampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(CnaHystrixSampleApplication.class, args);
	}
}
