package com.swr302.hivsystem.hivbackend.config;

import com.swr302.hivsystem.hivbackend.model.Role;
import com.swr302.hivsystem.hivbackend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        createRoleIfNotExists("PATIENT", "Standard patient role");
        createRoleIfNotExists("DOCTOR", "Doctor role with medical privileges");
        createRoleIfNotExists("ADMIN", "Administrator role with full access");
        createRoleIfNotExists("STAFF", "Staff role for general administrative tasks");
    }

    private void createRoleIfNotExists(String roleName, String description) {
        if (roleRepository.findByRoleName(roleName).isEmpty()) {
            Role role = new Role();
            role.setRoleName(roleName);
            role.setDescription(description);
            roleRepository.save(role);
            System.out.println("Created role: " + roleName);
        }
    }
} 