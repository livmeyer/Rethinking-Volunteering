package com.rethinkingvolunteering.ApplicationBackend.controller;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import com.rethinkingvolunteering.ApplicationBackend.service.VolunteerService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {

    private final VolunteerRepository volunteerRepository;
    private final VolunteerService volunteerService;
    private final PasswordEncoder passwordEncoder;

    public VolunteerController(VolunteerRepository volunteerRepository, VolunteerService volunteerService, PasswordEncoder passwordEncoder) {
        this.volunteerRepository = volunteerRepository;
        this.volunteerService = volunteerService;
        this.passwordEncoder = passwordEncoder;
    }

    // ----- Registration -----
    @PostMapping("/registration")
    public Map<String, Boolean> register(@RequestBody VolunteerRegisterRequest body) {
        Volunteer v = volunteerService.registerVolunteer(body.name(), body.email(), passwordEncoder.encode(body.password()));
        return Map.of("success", true);
    }

    // ----- for setting up the test volunteers -----
    public void volunteerPasswordSetup(String email, String password) {
        Volunteer v = volunteerRepository.findByEmail(email);
        v.setPassword(passwordEncoder.encode(password));
        volunteerRepository.save(v);
    }

    // ----- Fake Login -----
    @PostMapping("/login")
    public Map<String, Boolean> login(@RequestBody VolunteerLoginRequest body) {
        String email = body.email();
        String password = body.password();

        Volunteer volunteer = volunteerRepository.findByEmail(email);
        boolean ok = volunteer != null && passwordEncoder.matches(password, volunteer.getPassword());
        return Map.of("success", ok);
    }

    // Dashboard
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(@RequestParam String email) {
        Volunteer v = volunteerRepository.findByEmail(email);
        if (v == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Volunteer not found with email: " + email
            );
        }

        return volunteerService.getDashboard(v);
    }


    public record VolunteerRegisterRequest(String name, String email, String password) {}
    public record VolunteerLoginRequest(String email, String password) {}
}
