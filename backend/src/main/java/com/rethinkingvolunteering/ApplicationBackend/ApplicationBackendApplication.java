package com.rethinkingvolunteering.ApplicationBackend;

import com.rethinkingvolunteering.ApplicationBackend.controller.TimeSlotController;
import com.rethinkingvolunteering.ApplicationBackend.controller.VolunteerController;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@SpringBootApplication
public class ApplicationBackendApplication {

	private final VolunteerController volunteerController;
	private final TimeSlotController timeSlotController;

	public ApplicationBackendApplication(VolunteerController volunteerController, TimeSlotController timeSlotController) {
		this.volunteerController = volunteerController;
		this.timeSlotController = timeSlotController;
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
		volunteerController.volunteerPasswordSetup("test@test.com", "test");
	}
}
