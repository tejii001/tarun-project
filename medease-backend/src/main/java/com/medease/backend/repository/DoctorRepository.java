package com.medease.backend.repository;

import com.medease.backend.entity.Doctor;
import com.medease.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByIsAvailableTrue();
    List<Doctor> findBySpecialization(String specialization);
}
