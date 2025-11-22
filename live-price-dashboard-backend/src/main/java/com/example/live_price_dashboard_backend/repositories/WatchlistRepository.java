package com.example.live_price_dashboard_backend.repositories;

import com.example.live_price_dashboard_backend.models.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    
    List<Watchlist> findByUserId(Long userId);
    
    @Query("SELECT w.symbol FROM Watchlist w WHERE w.user.id = :userId")
    List<String> findSymbolsByUserId(@Param("userId") Long userId);
    
    boolean existsByUserIdAndSymbol(Long userId, String symbol);
    
    void deleteByUserIdAndSymbol(Long userId, String symbol);
}
