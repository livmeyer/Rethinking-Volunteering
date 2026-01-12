package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public Volunteer registerVolunteer(String name, String email, String password) {
        String cleanName = name == null ? "" : name.trim();
        String cleanEmail = email == null ? "" : email.trim();
        String cleanPassword = password == null ? "" : password;

        if (cleanName.isBlank() || cleanEmail.isBlank() || cleanPassword.isBlank()) {
            throw new IllegalArgumentException("Bitte geben Sie Namen, Email und Passwort an.");
        }

        Volunteer existing = volunteerRepository.findByEmail(cleanEmail);
        if (existing != null) {
            throw new IllegalArgumentException("Diese Email wird bereits verwendet.");
        }

        Volunteer v = new Volunteer();
        v.setName(cleanName);
        v.setEmail(cleanEmail);
        v.setPassword(cleanPassword);

        return volunteerRepository.save(v);
    }
}
