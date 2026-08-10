package com.vitalcore.service;

import com.vitalcore.enums.AppointmentStatus;
import com.vitalcore.exception.DuplicateResourceException;
import com.vitalcore.exception.ResourceNotFoundException;
import com.vitalcore.model.Appointment;
import com.vitalcore.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public Appointment bookAppointment(Appointment appointment) {
        // Conflict check: Ensure the doctor is not already booked at this time
        // Ignore CANCELLED appointments when checking for conflicts
        boolean conflict = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                appointment.getDoctorId(), 
                appointment.getAppointmentDate(), 
                appointment.getAppointmentTime(),
                AppointmentStatus.CANCELLED
        );
        
        if (conflict) {
            throw new IllegalStateException("Doctor is already booked for this time slot.");
        }
        
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        appointment.setStatus(AppointmentStatus.SCHEDULED);
        
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }
    
    public List<Appointment> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }
    
    public List<Appointment> getAppointmentsByDoctorId(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }
    
    public List<Appointment> getAppointmentsByDoctorAndDate(String doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
    }

    public Appointment getAppointmentById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
    }

    public Appointment updateAppointmentStatus(String id, AppointmentStatus status, String notes) {
        Appointment existing = getAppointmentById(id);
        existing.setStatus(status);
        if (notes != null) {
            existing.setNotes(notes);
        }
        existing.setUpdatedAt(LocalDateTime.now());
        return appointmentRepository.save(existing);
    }
}
