package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.repository.TimeSlotRepository;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {

    private final TimeSlotRepository repository;

    public TimeSlotService(TimeSlotRepository repository) {
        this.repository = repository;
    }

    public List<LocalDate> getAvailableDates(Location location) {
        return repository.findByLocationEquals(location).stream()
                .map(o -> o.getStartTime().toLocalDate())
                .sorted().collect(Collectors.toList());
    }

    public List<LocalDateTime> getAvailableTimeSlots(Location location, LocalDate date) {
        return repository.findByLocationEquals(location).stream()
                .map(TimeSlot::getStartTime)
                .filter(startTime -> startTime.toLocalDate().equals(date))
                .sorted()
                .collect(Collectors.toList());
    }
}
