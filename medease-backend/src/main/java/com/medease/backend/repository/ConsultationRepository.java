package com.medease.backend.repository;

import com.medease.backend.entity.Consultation;
import com.medease.backend.entity.ConsultationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByAppointmentId(Long appointmentId);
    List<Consultation> findByStatus(ConsultationStatus status);
}
