package com.inventra;

import com.inventra.model.User;
import com.inventra.repository.UserRepository;
import com.inventra.security.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(
        UserRepository userRepository,
        BCryptPasswordEncoder encoder,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    // TEMPORARY REGISTER (FIRST USER)
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        user.setPassword(encoder.encode(user.getPassword()));

        if (user.getRole() == null) {
            user.setRole("ADMIN"); // first user becomes admin
        }

        userRepository.save(user);
        return "User registered";
    }

    

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody User req) {

        User dbUser = userRepository
            .findByUsername(req.getUsername())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
            dbUser.getUsername(),
            dbUser.getRole()
        );

        return new LoginResponse(token, dbUser.getRole());
    }
}
