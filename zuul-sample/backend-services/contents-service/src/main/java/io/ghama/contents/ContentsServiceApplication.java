package io.ghama.contents;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class ContentsServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContentsServiceApplication.class, args);
	}

}
