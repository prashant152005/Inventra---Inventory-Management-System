package com.inventra;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventra.model.EmailOtp;
import com.inventra.model.RegisterRequest;
import com.inventra.model.User;
import com.inventra.repository.EmailOtpRepository;
import com.inventra.repository.UserRepository;
import com.inventra.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailOtpRepository otpRepo;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthController(
        UserRepository userRepository,
        EmailOtpRepository otpRepo,
        BCryptPasswordEncoder encoder,
        JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.otpRepo = otpRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    // SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        EmailOtp emailOtp = otpRepo
            .findByEmail(email)
            .orElse(new EmailOtp());

        emailOtp.setEmail(email);
        emailOtp.setOtp(otp);
        emailOtp.setExpiry(LocalDateTime.now().plusMinutes(5));

        otpRepo.save(emailOtp);

        // TEMP (replace with email service later)
        System.out.println("OTP for " + email + " = " + otp);

        return "OTP sent";
    }

    // REGISTER 
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest req) {

        // OTP check
        EmailOtp storedOtp = otpRepo.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (
            !storedOtp.getOtp().equals(req.getOtp()) ||
            storedOtp.getExpiry().isBefore(LocalDateTime.now())
        ) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // Duplicate checks
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create user
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPassword(encoder.encode(req.getPassword()));

        // safety: allow only ADMIN / STAFF
        if (!req.getRole().equals("ADMIN") && !req.getRole().equals("STAFF")) {
            user.setRole("STAFF");
        } else {
            user.setRole(req.getRole());
        }

        user.setEmailVerified(true);

        userRepository.save(user);
        otpRepo.delete(storedOtp);

        return "User registered successfully";
    }

    //LOGIN 
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
