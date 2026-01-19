package com.inventra.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.inventra.model.Product;
import com.inventra.repository.ProductRepository;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private ProductRepository productRepository;

    // VIEW PRODUCTS (ADMIN + STAFF)
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // ADD / UPDATE PRODUCT & STOCK (ADMIN ONLY)
    @PostMapping("/update")
    public String addOrUpdateProduct(@RequestBody Product incoming) {

        Product existing = productRepository.findBySku(incoming.getSku());

        if (existing == null) {
            // NEW PRODUCT
            productRepository.save(incoming);
            return "Product added";
        } else {
            // UPDATE EXISTING PRODUCT
            int newQty = existing.getQuantity() + incoming.getQuantity();

            if (newQty < 0) {
                throw new RuntimeException("Insufficient stock");
            }

            existing.setQuantity(newQty);
            existing.setUnitPrice(incoming.getUnitPrice());
            existing.setProductName(incoming.getProductName());
            existing.setReorderLevel(incoming.getReorderLevel());

            productRepository.save(existing);
            return "Product updated";
        }
    }

    // DELETE PRODUCT (ADMIN ONLY)
    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable String id) {
        productRepository.deleteById(id);
        return "Product deleted";
    }
}
