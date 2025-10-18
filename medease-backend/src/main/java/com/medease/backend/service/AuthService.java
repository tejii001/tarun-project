package com.medease.backend.service;

import com.medease.backend.dto.AuthResponse;
import com.medease.backend.dto.LoginRequest;
import com.medease.backend.dto.RegisterRequest;
import com.medease.backend.entity.*;
import com.medease.backend.repository.*;
import com.medease.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthService {
    
    @Autowired
    AuthenticationManager authenticationManager;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    PatientRepository patientRepository;
    
    @Autowired
    DoctorRepository doctorRepository;
    
    @Autowired
    PasswordEncoder encoder;
    
    @Autowired
    JwtUtils jwtUtils;
    
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already taken!");
        }
        
        // Create user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());
        user.setPhone(registerRequest.getPhone());
        
        if (registerRequest.getDateOfBirth() != null) {
            user.setDateOfBirth(LocalDateTime.parse(registerRequest.getDateOfBirth() + "T00:00:00"));
        }
        
        user = userRepository.save(user);
        
        // Create role-specific entity
        if (registerRequest.getRole() == Role.PATIENT) {
            Patient patient = new Patient();
            patient.setUser(user);
            patient.setAddress(registerRequest.getAddress());
            patient.setEmergencyContact(registerRequest.getEmergencyContact());
            patient.setMedicalHistory(registerRequest.getMedicalHistory());
            patient.setAllergies(registerRequest.getAllergies());
            patient.setBloodType(registerRequest.getBloodType());
            patientRepository.save(patient);
        } else if (registerRequest.getRole() == Role.DOCTOR) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setSpecialization(registerRequest.getSpecialization());
            doctor.setLicenseNumber(registerRequest.getLicenseNumber());
            doctor.setExperienceYears(registerRequest.getExperienceYears());
            doctor.setQualification(registerRequest.getQualification());
            doctor.setConsultationFee(registerRequest.getConsultationFee());
            doctor.setBio(registerRequest.getBio());
            doctorRepository.save(doctor);
        }
        
        // Generate JWT token
        String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());
        
        return new AuthResponse(jwt, new AuthResponse.UserInfo(
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole()
        ));
    }
    
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        return new AuthResponse(jwt, new AuthResponse.UserInfo(
            userDetails.getId(),
            userDetails.getFirstName(),
            userDetails.getLastName(),
            userDetails.getEmail(),
            userDetails.getRole()
        ));
    }
    
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            return userRepository.findById(userDetails.getId()).orElse(null);
        }
        return null;
    }
}
