package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.Alert;

public interface AlertRepository extends MongoRepository<Alert, String> {
}
