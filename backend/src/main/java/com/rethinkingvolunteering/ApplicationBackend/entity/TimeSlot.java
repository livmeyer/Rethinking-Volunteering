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

    private int volunteerId;

    @Column(name="topics")
    private String topics;

    @Enumerated(EnumType.STRING)
    private Location location;

    private boolean isBooked;

    private String customerName;

    private boolean completed;

    public TimeSlot() {
    }

    public TimeSlot(int volunteerId, String topics, Location location, LocalDateTime startTime) {
        this.volunteerId = volunteerId;
        this.location = location;
        this.startTime = startTime;
        this.topics = topics;
        this.completed = false;
        this.isBooked = false;
        this.customerName = "";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
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

    public String getTopic() {
        return topics;
    }

    public void setTopic(String topics) {
        this.topics = topics;
    }

    public int getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(int volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
