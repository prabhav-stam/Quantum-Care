package com.vitalcore.repository;

import com.vitalcore.model.Medicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
    
    @Query("{ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }")
    List<Medicine> findByStockQuantityLessThanEqualReorderLevel();
    
    List<Medicine> findByIsActiveTrue();
}
