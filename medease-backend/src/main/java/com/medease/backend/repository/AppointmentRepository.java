package com.medease.backend.repository;

import com.medease.backend.entity.Appointment;
import com.medease.backend.entity.AppointmentStatus;
import com.medease.backend.entity.Doctor;
import com.medease.backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);
    List<Appointment> findByPatientAndStatus(Patient patient, AppointmentStatus status);
    List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorAndDateRange(@Param("doctor") Doctor doctor, 
                                             @Param("startDate") LocalDateTime startDate, 
                                             @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND DATE(a.appointmentDate) = DATE(:date)")
    List<Appointment> findByDoctorAndDate(@Param("doctor") Doctor doctor, @Param("date") LocalDateTime date);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate > :now AND a.status = 'CONFIRMED' ORDER BY a.appointmentDate ASC")
    List<Appointment> findUpcomingAppointments(@Param("now") LocalDateTime now);
}
