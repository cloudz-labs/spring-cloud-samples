package io.ghama.personalization;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class PersonalizationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersonalizationServiceApplication.class, args);
	}
}
