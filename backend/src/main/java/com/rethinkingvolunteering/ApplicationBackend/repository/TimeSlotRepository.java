package com.rethinkingvolunteering.ApplicationBackend.repository;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    List<TimeSlot> findByLocation (Location location);

    List<TimeSlot> findByTopic (Topic topic);

    List<TimeSlot> findByTopicAndLocation (Topic topic, Location location);

    Optional<TimeSlot> findById (Long Id);

    @Query("SELECT t FROM TimeSlot t WHERE t.volunteerId = :id AND t.startTime < :time")
    List<TimeSlot> getPastTimeSlotsByVolunteerId(@Param("id") int id, @Param("time") LocalDateTime time);


    @Query("SELECT t from TimeSlot t WHERE t.volunteerId = :id AND t.startTime > :time")
    List<TimeSlot> getUpcomingTimeSlotsByVolunteerId(@Param("id") int id, @Param("time") LocalDateTime time);
}
