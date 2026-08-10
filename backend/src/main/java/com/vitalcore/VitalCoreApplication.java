package com.vitalcore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * VitalCore - Smart Hospital Management Platform
 * 
 * Main entry point for the Spring Boot application.
 * 
 * @EnableMongoAuditing - Enables automatic population of @CreatedDate and @LastModifiedDate fields
 * @SpringBootApplication - Combines @Configuration, @EnableAutoConfiguration, @ComponentScan
 */
@SpringBootApplication
@EnableMongoAuditing
public class VitalCoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(VitalCoreApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  VitalCore Backend is running!");
        System.out.println("  API:     http://localhost:8080/api");
        System.out.println("  Swagger: http://localhost:8080/swagger-ui.html");
        System.out.println("========================================\n");
    }
}
