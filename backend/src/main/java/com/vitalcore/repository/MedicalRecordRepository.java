package com.vitalcore.repository;

import com.vitalcore.model.MedicalRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(String patientId);
    List<MedicalRecord> findByDoctorId(String doctorId);
}
