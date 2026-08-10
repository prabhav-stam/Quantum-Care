package com.vitalcore.config;

import com.vitalcore.enums.Role;
import com.vitalcore.model.Doctor;
import com.vitalcore.model.Medicine;
import com.vitalcore.model.Patient;
import com.vitalcore.model.User;
import com.vitalcore.repository.DoctorRepository;
import com.vitalcore.repository.MedicineRepository;
import com.vitalcore.repository.PatientRepository;
import com.vitalcore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicineRepository medicineRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
            seedMedicines();
            System.out.println("Data seeding completed.");
        }
    }

    private void seedUsers() {
        // 1. Admin
        User admin = User.builder()
                .email("admin@vitalcore.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("System")
                .lastName("Admin")
                .phone("1112223333")
                .role(Role.ADMIN)
                .isActive(true)
                .build();
        userRepository.save(admin);

        // 2. Doctor 1 (Cardiology)
        User doctor1 = User.builder()
                .email("dr.smith@vitalcore.com")
                .password(passwordEncoder.encode("doctor123"))
                .firstName("John")
                .lastName("Smith")
                .phone("2223334444")
                .role(Role.DOCTOR)
                .isActive(true)
                .build();
        doctor1 = userRepository.save(doctor1);
        
        Doctor d1 = Doctor.builder()
                .userId(doctor1.getId())
                .firstName(doctor1.getFirstName())
                .lastName(doctor1.getLastName())
                .email(doctor1.getEmail())
                .specialization("Cardiology")
                .schedule(new ArrayList<>())
                .isActive(true)
                .build();
        doctorRepository.save(d1);

        // 3. Doctor 2 (Neurology)
        User doctor2 = User.builder()
                .email("dr.johnson@vitalcore.com")
                .password(passwordEncoder.encode("doctor123"))
                .firstName("Sarah")
                .lastName("Johnson")
                .phone("3334445555")
                .role(Role.DOCTOR)
                .isActive(true)
                .build();
        doctor2 = userRepository.save(doctor2);
        
        Doctor d2 = Doctor.builder()
                .userId(doctor2.getId())
                .firstName(doctor2.getFirstName())
                .lastName(doctor2.getLastName())
                .email(doctor2.getEmail())
                .specialization("Neurology")
                .schedule(new ArrayList<>())
                .isActive(true)
                .build();
        doctorRepository.save(d2);

        // 4. Patient 1
        User patient1 = User.builder()
                .email("john.doe@vitalcore.com")
                .password(passwordEncoder.encode("patient123"))
                .firstName("John")
                .lastName("Doe")
                .phone("4445556666")
                .role(Role.PATIENT)
                .isActive(true)
                .build();
        patient1 = userRepository.save(patient1);
        
        Patient p1 = Patient.builder()
                .userId(patient1.getId())
                .firstName(patient1.getFirstName())
                .lastName(patient1.getLastName())
                .email(patient1.getEmail())
                .phone(patient1.getPhone())
                .build();
        patientRepository.save(p1);

        // 5. Patient 2
        User patient2 = User.builder()
                .email("jane.wilson@vitalcore.com")
                .password(passwordEncoder.encode("patient123"))
                .firstName("Jane")
                .lastName("Wilson")
                .phone("5556667777")
                .role(Role.PATIENT)
                .isActive(true)
                .build();
        patient2 = userRepository.save(patient2);
        
        Patient p2 = Patient.builder()
                .userId(patient2.getId())
                .firstName(patient2.getFirstName())
                .lastName(patient2.getLastName())
                .email(patient2.getEmail())
                .phone(patient2.getPhone())
                .build();
        patientRepository.save(p2);

        // 6. Receptionist
        User receptionist = User.builder()
                .email("reception@vitalcore.com")
                .password(passwordEncoder.encode("reception123"))
                .firstName("Front")
                .lastName("Desk")
                .phone("6667778888")
                .role(Role.RECEPTIONIST)
                .isActive(true)
                .build();
        userRepository.save(receptionist);
        
        System.out.println("Users seeded:");
        System.out.println("admin@vitalcore.com / admin123 (ADMIN)");
        System.out.println("dr.smith@vitalcore.com / doctor123 (DOCTOR - Cardiology)");
        System.out.println("dr.johnson@vitalcore.com / doctor123 (DOCTOR - Neurology)");
        System.out.println("john.doe@vitalcore.com / patient123 (PATIENT)");
        System.out.println("jane.wilson@vitalcore.com / patient123 (PATIENT)");
        System.out.println("reception@vitalcore.com / reception123 (RECEPTIONIST)");
    }

    private void seedMedicines() {
        Medicine m1 = Medicine.builder()
                .name("Amlodipine")
                .category("Cardiovascular")
                .stockQuantity(100)
                .unitPrice(10.5)
                .expiryDate(LocalDate.now().plusYears(2))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m1);

        Medicine m2 = Medicine.builder()
                .name("Metformin")
                .category("Antidiabetic")
                .stockQuantity(200)
                .unitPrice(5.0)
                .expiryDate(LocalDate.now().plusYears(1))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m2);

        Medicine m3 = Medicine.builder()
                .name("Amoxicillin")
                .category("Antibiotic")
                .stockQuantity(50)
                .unitPrice(15.0)
                .expiryDate(LocalDate.now().plusMonths(6))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m3);

        Medicine m4 = Medicine.builder()
                .name("Ibuprofen")
                .category("Painkiller")
                .stockQuantity(300)
                .unitPrice(8.0)
                .expiryDate(LocalDate.now().plusYears(3))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m4);

        Medicine m5 = Medicine.builder()
                .name("Omeprazole")
                .category("Gastrointestinal")
                .stockQuantity(150)
                .unitPrice(12.0)
                .expiryDate(LocalDate.now().plusYears(1))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m5);

        Medicine m6 = Medicine.builder()
                .name("Paracetamol")
                .category("Painkiller/Antipyretic")
                .stockQuantity(500)
                .unitPrice(2.5)
                .expiryDate(LocalDate.now().plusYears(4))
                .transactions(new ArrayList<>())
                .build();
        medicineRepository.save(m6);
    }
}
