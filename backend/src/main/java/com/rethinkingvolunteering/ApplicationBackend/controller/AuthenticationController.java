package com.rethinkingvolunteering.ApplicationBackend.controller;

import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/authentication")
public class AuthenticationController {

    private final VolunteerRepository volunteerRepository;

    public AuthenticationController(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    @PostMapping("/login")
    public boolean login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Volunteer volunteer = volunteerRepository.findByEmail(email);
        return volunteer != null && volunteer.getPassword().equals(password);
    }

}
