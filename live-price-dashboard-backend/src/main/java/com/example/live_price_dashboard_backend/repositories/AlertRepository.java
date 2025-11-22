package com.example.live_price_dashboard_backend.repositories;

import com.example.live_price_dashboard_backend.models.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    
    List<Alert> findByUserId(Long userId);
    
    List<Alert> findByUserIdAndIsActiveTrue(Long userId);
    
    @Query("SELECT a FROM Alert a WHERE a.symbol = :symbol AND a.isActive = true")
    List<Alert> findActiveAlertsBySymbol(@Param("symbol") String symbol);
    
    @Query("SELECT a FROM Alert a WHERE a.user.id = :userId AND a.symbol = :symbol AND a.isActive = true")
    List<Alert> findActiveAlertsByUserIdAndSymbol(@Param("userId") Long userId, @Param("symbol") String symbol);
}
