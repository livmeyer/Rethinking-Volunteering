package com.rethinkingvolunteering.ApplicationBackend.controller;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import com.rethinkingvolunteering.ApplicationBackend.service.TimeSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timeslots")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    @GetMapping("/locations")
    public List<Location> getAvailableLocations(@RequestParam GetLocationsRequest getLocationsRequest) {
        return timeSlotService.getAvailableLocations(getLocationsRequest.topic);
    }

    @GetMapping("/dates")
    public List<TimeSlot> getAvailableDates(@RequestParam Topic topic, @RequestParam Location location) {
        return this.timeSlotService.getAvailableDates(topic, location);
    }

    @GetMapping("/timeslots")
    public List<LocalDateTime> getAvailableTimeSlots(@RequestParam GetTimeslotsRequest req) {
        return this.timeSlotService.getAvailableTimeSlots(req.topic, req.location, req.date);
    }

    @GetMapping("/BookedSessions")
    public List<TimeSlot>  getBookedSessions(@RequestBody GetBookedSessions req) {
        return timeSlotService.getBookedSessions(req.volunteer);
    }
    
    @PostMapping("/timeslot")
    public TimeSlot createTimeSlot(@RequestBody PostTimeSlot req) {
        return timeSlotService.createTimeSlot(req.volunteer.getId(), req.topic, req.location, req.time);
    }

    @PutMapping("/book")
    public Map<String, Boolean> bookTimeSlot(@RequestParam TimeSlot timeSlot) {
        return timeSlotService.bookTimesSlot(timeSlot);
    }
    
    public record GetLocationsRequest(Topic topic) {}
    public record GetDatesRequest(Topic topic, Location location) {}
    public record getAvailableDates(Topic topic, Location location) {}
    public record GetTimeslotsRequest(Topic topic, Location location, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {}
    public record GetBookedSessions(Volunteer volunteer) {}
    public record PostTimeSlot(Volunteer volunteer,  Topic topic, Location location, LocalDateTime time) {}
}
