package com.skcc.eureka.sample;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import com.skcc.eureka.sample.DiscoveryServiceApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = DiscoveryServiceApplication.class)
@WebAppConfiguration
public class DiscoveryServiceApplicationTests {

	@Test
	public void contextLoads() {
	}

}
