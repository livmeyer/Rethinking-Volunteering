package com.rethinkingvolunteering.ApplicationBackend.repository;

import com.rethinkingvolunteering.ApplicationBackend.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Integer> {
}
