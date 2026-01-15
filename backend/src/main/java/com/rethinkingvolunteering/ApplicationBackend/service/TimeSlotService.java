package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.controller.TimeSlotController;
import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import com.rethinkingvolunteering.ApplicationBackend.repository.TimeSlotRepository;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;

    public TimeSlotService(TimeSlotRepository repository, VolunteerRepository volunteerRepository) {
        this.timeSlotRepository = repository;
    }

    public List<Location> getAvailableLocations(Topic topic){
        return timeSlotRepository.findByTopic(topic).stream()
                .filter(o->!o.isBooked())
                .map(TimeSlot::getLocation)
                .distinct().toList();
    }

    public List<TimeSlot> getAvailableDates(Topic topic, Location location) {
        return timeSlotRepository.findByTopicAndLocation(String.valueOf(topic), location);
    }

    public List<LocalDateTime> getAvailableTimeSlots(Topic topic, Location location, LocalDate date) {
        return timeSlotRepository.findByTopicAndLocation(String.valueOf(topic), location).stream()
                .filter(o->!o.isBooked())
                .map(TimeSlot::getStartTime)
                .filter(startTime -> startTime.toLocalDate().equals(date))
                .sorted()
                .collect(Collectors.toList());
    }

    public List<TimeSlot> getBookedSessions(Volunteer volunteer) {
        return timeSlotRepository.findByVolunteerId(volunteer.getId());
    }

    public Map<String, Boolean> bookTimesSlot(int slotId) {
        Optional<TimeSlot> optionalTimeSlot = timeSlotRepository.findById(slotId);
        if  (optionalTimeSlot.isPresent() && !optionalTimeSlot.get().isBooked()) {
            optionalTimeSlot.get().setBooked(true);
            timeSlotRepository.save(optionalTimeSlot.get());
            return Map.of("Success", Boolean.TRUE);
        }
        return Map.of("Fail", Boolean.FALSE);
    }

    public Map<String, Boolean> completeTimesSlot(int slotId) {
        Optional<TimeSlot> optionalTimeSlot = timeSlotRepository.findById(slotId);
        if  (optionalTimeSlot.isPresent() && optionalTimeSlot.get().isBooked() && !optionalTimeSlot.get().isCompleted()) {
            optionalTimeSlot.get().setCompleted(true);
            timeSlotRepository.save(optionalTimeSlot.get());
            return Map.of("Success", Boolean.TRUE);
        }
        return Map.of("Fail", Boolean.FALSE);
    }
}
