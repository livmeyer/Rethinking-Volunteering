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

    @Enumerated(EnumType.STRING)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    private Location location;

    private boolean isBooked;

    private String customerName;

    private boolean attended;

    public TimeSlot() {

    }

    public TimeSlot(int volunteerId, Topic topic, Location location, LocalDateTime startTime) {
        this.volunteerId = volunteerId;
        this.location = location;
        this.startTime = startTime;
        this.topic = topic;
        this.isBooked = false;
        this.customerName = "";
        this.attended = false;
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

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
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

    public boolean attended() {
        return attended;
    }

    public void setAttended(boolean wasAttended) {
        this.attended = wasAttended;
    }
}
