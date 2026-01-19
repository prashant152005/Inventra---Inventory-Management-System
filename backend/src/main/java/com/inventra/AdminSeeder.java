package com.inventra;

import com.inventra.model.User;
import com.inventra.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @PostConstruct
    public void createAdminIfNotExists() {

        userRepository.findByUsername("admin")
            .ifPresentOrElse(
                u -> System.out.println("✔ Admin already exists"),
                () -> {
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword(encoder.encode("admin123"));
                    admin.setRole("ADMIN");

                    userRepository.save(admin);
                    System.out.println("✅ Admin created (username=admin, password=admin123)");
                }
            );
    }
}
