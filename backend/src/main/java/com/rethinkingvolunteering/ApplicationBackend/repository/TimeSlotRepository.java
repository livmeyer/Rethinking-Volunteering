package com.rethinkingvolunteering.ApplicationBackend.repository;

import com.rethinkingvolunteering.ApplicationBackend.entity.TimeSlot;
import com.rethinkingvolunteering.ApplicationBackend.enums.Location;
import com.rethinkingvolunteering.ApplicationBackend.enums.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    List<TimeSlot> findByLocation (Location location);

    @Query("SELECT t FROM TimeSlot t WHERE t.topics LIKE CONCAT('%', :topic, '%')")
    List<TimeSlot> findByTopic (@Param("topic") Topic topic);

    @Query("SELECT t FROM TimeSlot t WHERE t.topics LIKE CONCAT('%', :topic, '%') AND t.location = :location AND t.isBooked = false")
    List<TimeSlot> findByTopicAndLocation (@Param("topic") String topic, @Param("location") Location location);

    List<TimeSlot> findByVolunteerId (Integer id);

    @Query("SELECT t FROM TimeSlot t WHERE t.volunteerId = :id AND t.startTime < :time ORDER BY t.startTime DESC")
    List<TimeSlot> getPastTimeSlotsByVolunteerId(@Param("id") int id, @Param("time") LocalDateTime time);


    @Query("SELECT t from TimeSlot t WHERE t.volunteerId = :id AND t.startTime > :time ORDER BY t.startTime ASC")
    List<TimeSlot> getUpcomingTimeSlotsByVolunteerId(@Param("id") int id, @Param("time") LocalDateTime time);
}
