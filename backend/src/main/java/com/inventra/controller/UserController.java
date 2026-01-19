package com.inventra.controller;

import java.util.List;
import com.inventra.model.User;
import com.inventra.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;
    
    // VIEW ALL USERS (ADMIN)
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // REGISTER STAFF (ADMIN)
    @PostMapping("/register")
    public String registerStaff(@RequestBody User user) {
        user.setRole("STAFF");
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return "Staff registered";
    }

    // DELETE STAFF (ADMIN)
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        userRepository.deleteById(id);
        return "User deleted";
    }
}
