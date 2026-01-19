package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.inventra.model.Category;

public interface CategoryRepository extends MongoRepository<Category, String> {
}
