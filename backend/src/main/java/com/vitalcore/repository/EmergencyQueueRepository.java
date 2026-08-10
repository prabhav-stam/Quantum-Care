package com.vitalcore.repository;

import com.vitalcore.enums.QueueStatus;
import com.vitalcore.model.EmergencyQueueEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyQueueRepository extends MongoRepository<EmergencyQueueEntry, String> {
    
    @Query(sort = "{ 'priority' : 1, 'checkedInAt' : 1 }")
    List<EmergencyQueueEntry> findByStatusIn(List<QueueStatus> statuses);

    default List<EmergencyQueueEntry> findByStatusInOrderByPriorityAscCheckedInAtAsc(List<QueueStatus> statuses) {
        return findByStatusIn(statuses);
    }
    
    List<EmergencyQueueEntry> findByAssignedDoctorIdAndStatusIn(String assignedDoctorId, List<QueueStatus> statuses);
}
