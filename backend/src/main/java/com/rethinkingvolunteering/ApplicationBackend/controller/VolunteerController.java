package com.rethinkingvolunteering.ApplicationBackend.controller;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import com.rethinkingvolunteering.ApplicationBackend.service.VolunteerService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;
    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerRepository volunteerRepository, VolunteerService volunteerService) {
        this.volunteerRepository = volunteerRepository;
        this.volunteerService = volunteerService;
    }

    // ----- Registration -----
    @PostMapping("/registration")
    public Volunteer register(@RequestBody VolunteerRegisterRequest body) {
        return volunteerService.registerVolunteer(body.name(), body.email(), body.password());
    }

    // ----- Fake Login -----
    @PostMapping("/login")
    public Map<String, Boolean> login(@RequestBody VolunteerLoginRequest body) {
        String email = body.email();
        String password = body.password();

        Volunteer volunteer = volunteerRepository.findByEmail(email);
        boolean ok = volunteer != null && volunteer.getPassword().equals(password);
        return Map.of("success", ok);
    }

    @PostMapping("/newAppointment")
    public boolean newAppointment(@RequestBody AddAppointmentRequest body) {
        return true;
    }

    public record VolunteerRegisterRequest(String name, String email, String password) {}
    public record VolunteerLoginRequest(String email, String password) {}
    public record AddAppointmentRequest(TimeSlot timeslot, Volunteer volunteer) {}
}
