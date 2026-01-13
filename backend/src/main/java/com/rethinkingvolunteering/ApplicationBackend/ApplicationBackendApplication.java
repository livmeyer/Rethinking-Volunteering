package com.rethinkingvolunteering.ApplicationBackend;

import com.rethinkingvolunteering.ApplicationBackend.controller.VolunteerController;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ApplicationBackendApplication {

	private final VolunteerController volunteerController;

	public ApplicationBackendApplication(VolunteerController volunteerController) {
		this.volunteerController = volunteerController;
	}

	public static void main(String[] args) {
		SpringApplication.run(ApplicationBackendApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	private void execCodeAfterStartup() {
		//Just for the test data, normal logins are handled as before
		volunteerController.volunteerPasswordSetup("anna@example.com", "password123");
		volunteerController.volunteerPasswordSetup("max@example.com", "password123");
		volunteerController.volunteerPasswordSetup("lisa@example.com", "password123");
	}
}
