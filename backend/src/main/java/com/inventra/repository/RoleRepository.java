package com.inventra.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.inventra.model.Role;

public interface RoleRepository extends MongoRepository<Role, String> {
}
