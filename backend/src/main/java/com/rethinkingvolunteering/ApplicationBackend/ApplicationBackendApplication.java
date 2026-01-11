package com.rethinkingvolunteering.ApplicationBackend;

import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ApplicationBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApplicationBackendApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void execCodeAfterStartup() {
	}
}
