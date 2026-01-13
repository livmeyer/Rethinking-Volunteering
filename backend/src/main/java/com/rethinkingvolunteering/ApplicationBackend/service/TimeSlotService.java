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
        List<TimeSlot> temp = timeSlotRepository.findByTopicAndLocation(topic, location);
        System.out.println("TimeSlotsFound: " + temp.size());
        return temp;
    }

    public List<LocalDateTime> getAvailableTimeSlots(Topic topic, Location location, LocalDate date) {
        return timeSlotRepository.findByTopicAndLocation(topic, location).stream()
                .filter(o->!o.isBooked())
                .map(TimeSlot::getStartTime)
                .filter(startTime -> startTime.toLocalDate().equals(date))
                .sorted()
                .collect(Collectors.toList());
    }

    public List<TimeSlot> getBookedSessions(Volunteer volunteer) {
        return timeSlotRepository.findByVolunteerId(volunteer.getId()).stream()
                .filter(o-> o.getStartTime().isBefore(LocalDateTime.now()) && o.isBooked())
                .toList();
    }

    public TimeSlot createTimeSlot(int volunteerId, Topic topic, Location location, LocalDateTime time) {
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setVolunteerId(volunteerId);
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
