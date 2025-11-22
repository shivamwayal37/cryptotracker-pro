package com.example.live_price_dashboard_backend.controllers;

import com.example.live_price_dashboard_backend.models.Alert;
import com.example.live_price_dashboard_backend.repositories.UserRepository;
import com.example.live_price_dashboard_backend.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Alert>> getUserAlerts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Alert> alerts = alertService.getUserAlerts(user.getId());
        return ResponseEntity.ok(alerts);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Alert>> getUserActiveAlerts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Alert> alerts = alertService.getUserActiveAlerts(user.getId());
        return ResponseEntity.ok(alerts);
    }
    
    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody AlertRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Alert alert = new Alert(user, request.getSymbol(), request.getThresholdPrice(), request.getCondition());
        Alert saved = alertService.createAlert(alert);
        
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{alertId}")
    public ResponseEntity<String> deleteAlert(@PathVariable Long alertId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        alertService.deleteAlert(alertId, user.getId());
        return ResponseEntity.ok("Alert deleted");
    }
    
    @PutMapping("/{alertId}/deactivate")
    public ResponseEntity<String> deactivateAlert(@PathVariable Long alertId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        alertService.deactivateAlert(alertId, user.getId());
        return ResponseEntity.ok("Alert deactivated");
    }
    
    // Inner class for request
    public static class AlertRequest {
        private String symbol;
        private BigDecimal thresholdPrice;
        private Alert.AlertCondition condition;
        
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        
        public BigDecimal getThresholdPrice() { return thresholdPrice; }
        public void setThresholdPrice(BigDecimal thresholdPrice) { this.thresholdPrice = thresholdPrice; }
        
        public Alert.AlertCondition getCondition() { return condition; }
        public void setCondition(Alert.AlertCondition condition) { this.condition = condition; }
    }
}
