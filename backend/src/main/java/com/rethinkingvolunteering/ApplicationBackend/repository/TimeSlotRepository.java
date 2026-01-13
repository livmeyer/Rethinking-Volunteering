package com.rethinkingvolunteering.ApplicationBackend.repository;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    @Query("select e.location from TimeSlot e")
    List<Location> findAllLocations();

    List<TimeSlot> findByLocationEquals (Location location);

    @Query("SELECT t FROM TimeSlot t WHERE t.volunteerId = :id")
    List<TimeSlot> getTimeSlotsByVolunteerId(@Param("id") int id);


    @Query("SELECT t from TimeSlot t WHERE t.volunteerId = :id AND t.startTime > :time")
    List<TimeSlot> getUpcomingTimeSlotsByVolunteerId(@Param("id") int id, @Param("time") LocalDateTime time);
}
