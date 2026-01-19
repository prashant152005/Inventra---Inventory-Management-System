package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.Product;

public interface ProductRepository extends MongoRepository<Product, String> {
    Product findBySku(String sku);
}
