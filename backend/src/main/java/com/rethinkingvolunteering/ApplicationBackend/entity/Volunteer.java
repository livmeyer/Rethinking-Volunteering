package com.rethinkingvolunteering.ApplicationBackend.entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    @OneToMany(mappedBy="volunteer")
    private List<TimeSlot> appointments;

    private int appointmentCount;


    public Volunteer(){

    }

    public Volunteer(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.appointmentCount = 0;
        this.appointments = null;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public int getAppointmentCount() {
        return appointmentCount;
    }

    public void setAppointmentCount(int appointmentCount) {
        this.appointmentCount = appointmentCount;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<TimeSlot> getAppointments() { return this.appointments; }

    @Override
    public String toString() {
        return "Volunteer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", appointmentCount=" + appointmentCount +
                '}';
    }
}
