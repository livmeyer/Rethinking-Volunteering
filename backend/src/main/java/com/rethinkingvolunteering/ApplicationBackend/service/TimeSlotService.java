package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.controller.TimeSlotController;
import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import com.rethinkingvolunteering.ApplicationBackend.repository.TimeSlotRepository;
import com.rethinkingvolunteering.ApplicationBackend.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final VolunteerRepository volunteerRepository;

    public TimeSlotService(TimeSlotRepository repository, VolunteerRepository volunteerRepository) {
        this.timeSlotRepository = repository;
        this.volunteerRepository = volunteerRepository;
    }

    public List<Location> getAvailableLocations(Topic topic){
        return timeSlotRepository.findByTopic(topic).stream()
                .filter(o->!o.isBooked())
                .map(TimeSlot::getLocation)
                .distinct().toList();
    }

    public List<LocalDate> getAvailableDates(Topic topic, Location location) {
        return timeSlotRepository.findByTopicAndLocation(topic, location).stream()
                .filter(o->!o.isBooked())
                .map(o -> o.getStartTime().toLocalDate())
                .sorted().collect(Collectors.toList());
    }

    public List<LocalDateTime> getAvailableTimeSlots(Topic topic, Location location, LocalDate date) {
        return timeSlotRepository.findByTopicAndLocation(topic, location).stream()
                .filter(o->!o.isBooked())
                .map(TimeSlot::getStartTime)
                .filter(startTime -> startTime.toLocalDate().equals(date))
                .sorted()
                .collect(Collectors.toList());
    }

    public TimeSlot createTimeSlot(Volunteer volunteer, Topic topic, Location location, LocalDateTime time) {
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setTopic(topic);
        timeSlot.setLocation(location);
        timeSlot.setStartTime(time);
        timeSlotRepository.save(timeSlot);
        return timeSlot;
    }

    public Map<String, Boolean> bookTimesSlot(TimeSlot timeSlot) {
        Optional<TimeSlot> optionalTimeSlot = timeSlotRepository.findById(timeSlot.getId());
        if  (optionalTimeSlot.isPresent() && !optionalTimeSlot.get().isBooked()) {
            optionalTimeSlot.get().setBooked(true);
            timeSlotRepository.save(optionalTimeSlot.get());
        }
        return Map.of("Success", Boolean.FALSE);
    }
}
