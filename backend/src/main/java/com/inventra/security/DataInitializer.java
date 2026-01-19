package com.inventra.security;

import com.inventra.model.User;
import com.inventra.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    public DataInitializer(
        UserRepository userRepository,
        BCryptPasswordEncoder encoder
    ) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {

        // ✅ If admin already exists, do nothing
        if (userRepository.findByUsername("admin").isPresent()) {
            return;
        }

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(encoder.encode("admin123"));
        admin.setRole("ADMIN");

        userRepository.save(admin);

        System.out.println("✅ DEFAULT ADMIN CREATED");
        System.out.println("👉 username: admin");
        System.out.println("👉 password: admin123");
    }
}
