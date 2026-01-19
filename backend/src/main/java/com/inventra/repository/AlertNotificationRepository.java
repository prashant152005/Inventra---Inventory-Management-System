package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.AlertNotification;

public interface AlertNotificationRepository
        extends MongoRepository<AlertNotification, String> {
}
