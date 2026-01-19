package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.inventra.model.Supplier;

public interface SupplierRepository extends MongoRepository<Supplier, String> {
}
