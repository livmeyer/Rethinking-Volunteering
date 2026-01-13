package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.repository.TimeSlotRepository;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    private final TimeSlotRepository timeSlotRepository;

    public VolunteerService(VolunteerRepository volunteerRepository, TimeSlotRepository timeSlotRepository) {
        this.volunteerRepository = volunteerRepository;
        this.timeSlotRepository = timeSlotRepository;
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

    public void addAppointment(Volunteer v, TimeSlot timeslot) {
        timeslot.setVolunteerId(v.getId());
    }

    public List<TimeSlot> getUpcomingAppointments(Volunteer v) {
        return timeSlotRepository.getUpcomingTimeSlotsByVolunteerId(v.getId(), LocalDateTime.now());
    }

    public List<TimeSlot> getPastAppointments(Volunteer v) {
        return timeSlotRepository.getTimeSlotsByVolunteerId(v.getId());
    }

    public Map<String, Object> getDashboard(Volunteer v) {
        Map<String, Object> m = new HashMap<>();
        m.put("upcoming", getUpcomingAppointments(v));
        m.put("past", getPastAppointments(v));
        m.put("progress", (double) (getPastAppointments(v).size() / 25));
        return m;
    }


}
