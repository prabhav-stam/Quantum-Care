package com.vitalcore.service;

import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.Patient;
import com.vitalcore.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(String id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", id));
    }

    public Patient getPatientByUserId(String userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "userId", userId));
    }

    public Patient updatePatient(String id, Patient updateData) {
        Patient existing = getPatientById(id);
        
        if (updateData.getDateOfBirth() != null) existing.setDateOfBirth(updateData.getDateOfBirth());
        if (updateData.getGender() != null) existing.setGender(updateData.getGender());
        if (updateData.getBloodGroup() != null) existing.setBloodGroup(updateData.getBloodGroup());
        if (updateData.getAddress() != null) existing.setAddress(updateData.getAddress());
        if (updateData.getEmergencyContactName() != null) existing.setEmergencyContactName(updateData.getEmergencyContactName());
        if (updateData.getEmergencyContactPhone() != null) existing.setEmergencyContactPhone(updateData.getEmergencyContactPhone());
        
        existing.setUpdatedAt(LocalDateTime.now());
        
        return patientRepository.save(existing);
    }
}
