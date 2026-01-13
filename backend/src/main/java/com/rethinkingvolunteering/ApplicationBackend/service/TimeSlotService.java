package com.rethinkingvolunteering.ApplicationBackend.service;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
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
                .map(o -> o.getStartTime().toLocalDate())
                .sorted().collect(Collectors.toList());
    }

    public List<LocalDateTime> getAvailableTimeSlots(Topic topic, Location location, LocalDate date) {
        return timeSlotRepository.findByTopicAndLocation(topic, location).stream()
                .map(TimeSlot::getStartTime)
                .filter(startTime -> startTime.toLocalDate().equals(date))
                .sorted()
                .collect(Collectors.toList());
    }

    /*

    public void addAppointment(String email,
                               Location location,
                               LocalDateTime dateAndTime,
                               Topic topic) {
        TimeSlot t = new TimeSlot(
                volunteerRepository.findByEmail(email).getId(),
                topic,
                location,
                dateAndTime
        );
    }

     */
}
