package com.vitalcore.service;

import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.MedicalRecord;
import com.vitalcore.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createRecord(MedicalRecord record) {
        if (record.getVisitDate() == null) {
            record.setVisitDate(LocalDate.now());
        }
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> getRecordsByPatientId(String patientId) {
        return medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
    }

    public MedicalRecord getRecordById(String id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", "id", id));
    }
}
