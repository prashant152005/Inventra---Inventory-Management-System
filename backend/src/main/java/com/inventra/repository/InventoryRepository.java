package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.Inventory;

public interface InventoryRepository
        extends MongoRepository<Inventory, String> {

    Inventory findByProductId(String productId);
}

