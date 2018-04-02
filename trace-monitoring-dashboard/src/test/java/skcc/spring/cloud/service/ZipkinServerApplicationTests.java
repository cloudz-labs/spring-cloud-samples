package skcc.spring.cloud.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import skcc.spring.cloud.service.ZipkinServerApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = ZipkinServerApplication.class)
public class ZipkinServerApplicationTests {

	@Test
	public void contextLoads() {
	}

}
