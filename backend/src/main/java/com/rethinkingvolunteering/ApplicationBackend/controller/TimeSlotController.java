package com.rethinkingvolunteering.ApplicationBackend.controller;



import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import com.rethinkingvolunteering.ApplicationBackend.repository.TimeSlotRepository;
import com.rethinkingvolunteering.ApplicationBackend.service.TimeSlotService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

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
    public List<LocalDate> getAvailableDates(@RequestParam GetDatesRequest req) {
        return this.timeSlotService.getAvailableDates(req.topic, req.location);
    }

    @GetMapping("/timeslots")
    public List<LocalDateTime> getAvailableTimeSlots(@RequestParam GetTimeslotsRequest req) {
        return this.timeSlotService.getAvailableTimeSlots(req.topic, req.location, req.date);
    }

    public record GetLocationsRequest(Topic topic) {}
    public record GetDatesRequest(Topic topic, Location location) {}
    public record GetTimeslotsRequest(Topic topic, Location location, @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {}
}
