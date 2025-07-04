package com.swr302.hivsystem.hivbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
@EntityScan("com.swr302.hivsystem.hivbackend.model")
@EnableJpaRepositories("com.swr302.hivsystem.hivbackend.repository")
public class HivBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(HivBackendApplication.class, args);
    }
} 