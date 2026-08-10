package com.vitalcore.repository;

import com.vitalcore.enums.AppointmentStatus;
import com.vitalcore.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(String doctorId, LocalDate appointmentDate, String appointmentTime, AppointmentStatus status);
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);
    List<Appointment> findByStatus(AppointmentStatus status);
    long countByAppointmentDate(LocalDate appointmentDate);
}
