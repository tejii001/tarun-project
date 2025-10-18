package com.medease.backend.service;

import com.medease.backend.entity.*;
import com.medease.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    
    @Autowired
    AppointmentRepository appointmentRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @Autowired
    DoctorRepository doctorRepository;
    
    @Autowired
    AuthService authService;
    
    public List<Appointment> getAllAppointments() {
        User currentUser = authService.getCurrentUser();
        if (currentUser.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(currentUser).orElse(null);
            if (patient != null) {
                return appointmentRepository.findByPatient(patient);
            }
        } else if (currentUser.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByUser(currentUser).orElse(null);
            if (doctor != null) {
                return appointmentRepository.findByDoctor(doctor);
            }
        }
        return List.of();
    }
    
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }
    
    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        User currentUser = authService.getCurrentUser();
        if (currentUser.getRole() == Role.PATIENT) {
            Patient patient = patientRepository.findByUser(currentUser).orElse(null);
            if (patient != null) {
                appointment.setPatient(patient);
                appointment.setStatus(AppointmentStatus.PENDING);
                return appointmentRepository.save(appointment);
            }
        }
        throw new RuntimeException("Unable to create appointment");
    }
    
    @Transactional
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            appointment.setNotes(appointmentDetails.getNotes());
            appointment.setStatus(appointmentDetails.getStatus());
            appointment.setPrescription(appointmentDetails.getPrescription());
            appointment.setDiagnosis(appointmentDetails.getDiagnosis());
            return appointmentRepository.save(appointment);
        }
        throw new RuntimeException("Appointment not found");
    }
    
    @Transactional
    public void cancelAppointment(Long id) {
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(id);
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setStatus(AppointmentStatus.CANCELLED);
            appointmentRepository.save(appointment);
        } else {
            throw new RuntimeException("Appointment not found");
        }
    }
    
    public List<Appointment> getAvailableSlots(Long doctorId, LocalDateTime date) {
        Optional<Doctor> doctorOptional = doctorRepository.findById(doctorId);
        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            return appointmentRepository.findByDoctorAndDate(doctor, date);
        }
        return List.of();
    }
    
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findByIsAvailableTrue();
    }
    
    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }
}
