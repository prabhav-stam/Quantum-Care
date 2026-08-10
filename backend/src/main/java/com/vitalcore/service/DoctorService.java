package com.vitalcore.service;

import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.Doctor;
import com.vitalcore.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }
    
    public List<Doctor> getActiveDoctors() {
        return doctorRepository.findByIsActiveTrue();
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
    }

    public Doctor getDoctorByUserId(String userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "userId", userId));
    }

    public Doctor updateDoctor(String id, Doctor updateData) {
        Doctor existing = getDoctorById(id);
        
        if (updateData.getSpecialization() != null) existing.setSpecialization(updateData.getSpecialization());
        if (updateData.getQualification() != null) existing.setQualification(updateData.getQualification());
        if (updateData.getLicenseNumber() != null) existing.setLicenseNumber(updateData.getLicenseNumber());
        if (updateData.getConsultationFee() > 0) existing.setConsultationFee(updateData.getConsultationFee());
        if (updateData.getYearsOfExperience() >= 0) existing.setYearsOfExperience(updateData.getYearsOfExperience());
        if (updateData.getSchedule() != null) existing.setSchedule(updateData.getSchedule());
        existing.setActive(updateData.isActive());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return doctorRepository.save(existing);
    }
}
