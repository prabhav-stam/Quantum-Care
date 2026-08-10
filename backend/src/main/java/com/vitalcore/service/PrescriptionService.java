package com.vitalcore.service;

import com.vitalcore.enums.PrescriptionStatus;
import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.Prescription;
import com.vitalcore.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public Prescription createPrescription(Prescription prescription) {
        if (prescription.getPrescriptionDate() == null) {
            prescription.setPrescriptionDate(LocalDate.now());
        }
        if (prescription.getStatus() == null) {
            prescription.setStatus(PrescriptionStatus.ACTIVE);
        }
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getPrescriptionsByPatientId(String patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public Prescription getPrescriptionById(String id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", "id", id));
    }

    public Prescription updateStatus(String id, PrescriptionStatus status) {
        Prescription p = getPrescriptionById(id);
        p.setStatus(status);
        return prescriptionRepository.save(p);
    }
}
