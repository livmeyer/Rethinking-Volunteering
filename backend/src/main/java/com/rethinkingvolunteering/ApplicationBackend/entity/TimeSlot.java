package com.rethinkingvolunteering.ApplicationBackend.entity;

import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class TimeSlot {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @ManyToOne
    private Volunteer volunteer;

    @Enumerated(EnumType.STRING)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    private Location location;

    private boolean isBooked;

    private String customerName;

    public TimeSlot() {

    }

    public TimeSlot(Volunteer volunteer, Topic topic, Location location, LocalDateTime startTime, LocalDateTime endTime) {
        this.volunteer = volunteer;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.topic = topic;
        this.isBooked = false;
        this.customerName = "";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        isBooked = booked;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

}
