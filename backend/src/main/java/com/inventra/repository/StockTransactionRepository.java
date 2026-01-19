package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.StockTransaction;

public interface StockTransactionRepository
        extends MongoRepository<StockTransaction, String> {
}
