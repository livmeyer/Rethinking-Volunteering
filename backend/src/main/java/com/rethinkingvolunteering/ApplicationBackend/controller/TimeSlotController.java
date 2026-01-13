package com.rethinkingvolunteering.ApplicationBackend.controller;


import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
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

    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotRepository timeSlotRepository, TimeSlotService timeSlotService) {
        this.timeSlotRepository = timeSlotRepository;
        this.timeSlotService = timeSlotService;
    }

    @GetMapping("/locations")
    public List<Location> getAvailableLocations() {
        return this.timeSlotRepository.findAllLocations();
    }

    @GetMapping("/dates")
    public List<LocalDate> getAvailableDates(@RequestParam Location location) {
        return this.timeSlotService.getAvailableDates(location);
    }

    @GetMapping("/timeslots")
    public List<LocalDateTime> getAvailableTimeSlots(
            @RequestParam Location location,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return this.timeSlotService.getAvailableTimeSlots(location, date);
    }


}
