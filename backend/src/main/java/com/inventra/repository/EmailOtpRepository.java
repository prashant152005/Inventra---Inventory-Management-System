package com.inventra.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.EmailOtp;

public interface EmailOtpRepository extends MongoRepository<EmailOtp, String> {
    Optional<EmailOtp> findByEmail(String email);
}
