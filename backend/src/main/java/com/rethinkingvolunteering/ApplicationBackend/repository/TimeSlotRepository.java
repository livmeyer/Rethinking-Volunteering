package com.rethinkingvolunteering.ApplicationBackend.repository;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    @Query("select e.location from TimeSlot e")
    List<Location> findAllLocations();

    List<TimeSlot> findByLocationEquals (Location location);
}
