package com.example.live_price_dashboard_backend.services;

import com.example.live_price_dashboard_backend.models.Alert;
import com.example.live_price_dashboard_backend.models.PriceData;
import com.example.live_price_dashboard_backend.repositories.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {
    
    @Autowired
    private AlertRepository alertRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    public void checkAlerts(String symbol, PriceData currentPrice) {
        List<Alert> activeAlerts = alertRepository.findActiveAlertsBySymbol(symbol);
        
        for (Alert alert : activeAlerts) {
            boolean triggered = false;
            
            if (alert.getCondition() == Alert.AlertCondition.ABOVE && 
                currentPrice.getPrice().compareTo(alert.getThresholdPrice()) > 0) {
                triggered = true;
            } else if (alert.getCondition() == Alert.AlertCondition.BELOW && 
                       currentPrice.getPrice().compareTo(alert.getThresholdPrice()) < 0) {
                triggered = true;
            }
            
            if (triggered) {
                triggerAlert(alert, currentPrice);
            }
        }
    }
    
    private void triggerAlert(Alert alert, PriceData priceData) {
        // Mark alert as triggered
        alert.setTriggeredAt(LocalDateTime.now());
        alert.setIsActive(false);
        alertRepository.save(alert);
        
        // Create notification
        AlertNotification notification = new AlertNotification(
            alert.getSymbol(),
            alert.getThresholdPrice(),
            priceData.getPrice(),
            alert.getCondition(),
            LocalDateTime.now()
        );
        
        // Send real-time notification to user
        messagingTemplate.convertAndSendToUser(
            alert.getUser().getUsername(),
            "/queue/alerts",
            notification
        );
        
        // Also send to general alerts topic
        messagingTemplate.convertAndSend("/topic/alerts", notification);
    }
    
    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }
    
    public List<Alert> getUserAlerts(Long userId) {
        return alertRepository.findByUserId(userId);
    }
    
    public List<Alert> getUserActiveAlerts(Long userId) {
        return alertRepository.findByUserIdAndIsActiveTrue(userId);
    }
    
    public void deleteAlert(Long alertId, Long userId) {
        Alert alert = alertRepository.findById(alertId)
            .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        if (!alert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this alert");
        }
        
        alertRepository.delete(alert);
    }
    
    public void deactivateAlert(Long alertId, Long userId) {
        Alert alert = alertRepository.findById(alertId)
            .orElseThrow(() -> new RuntimeException("Alert not found"));
        
        if (!alert.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this alert");
        }
        
        alert.setIsActive(false);
        alertRepository.save(alert);
    }
    
    // Inner class for alert notifications
    public static class AlertNotification {
        private String symbol;
        private java.math.BigDecimal thresholdPrice;
        private java.math.BigDecimal currentPrice;
        private Alert.AlertCondition condition;
        private LocalDateTime triggeredAt;
        
        public AlertNotification(String symbol, java.math.BigDecimal thresholdPrice, 
                               java.math.BigDecimal currentPrice, Alert.AlertCondition condition, 
                               LocalDateTime triggeredAt) {
            this.symbol = symbol;
            this.thresholdPrice = thresholdPrice;
            this.currentPrice = currentPrice;
            this.condition = condition;
            this.triggeredAt = triggeredAt;
        }
        
        // Getters
        public String getSymbol() { return symbol; }
        public java.math.BigDecimal getThresholdPrice() { return thresholdPrice; }
        public java.math.BigDecimal getCurrentPrice() { return currentPrice; }
        public Alert.AlertCondition getCondition() { return condition; }
        public LocalDateTime getTriggeredAt() { return triggeredAt; }
    }
}
