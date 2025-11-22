package com.example.live_price_dashboard_backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "alerts")
public class Alert {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @NotBlank
    @Size(max = 20)
    @Column(nullable = false)
    private String symbol;
    
    @NotNull
    @DecimalMin("0.0")
    @Column(name = "threshold_price", nullable = false, precision = 18, scale = 8)
    private BigDecimal thresholdPrice;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertCondition condition;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;
    
    public enum AlertCondition {
        ABOVE, BELOW
    }
    
    public Alert() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Alert(User user, String symbol, BigDecimal thresholdPrice, AlertCondition condition) {
        this();
        this.user = user;
        this.symbol = symbol;
        this.thresholdPrice = thresholdPrice;
        this.condition = condition;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public BigDecimal getThresholdPrice() {
        return thresholdPrice;
    }
    
    public void setThresholdPrice(BigDecimal thresholdPrice) {
        this.thresholdPrice = thresholdPrice;
    }
    
    public AlertCondition getCondition() {
        return condition;
    }
    
    public void setCondition(AlertCondition condition) {
        this.condition = condition;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getTriggeredAt() {
        return triggeredAt;
    }
    
    public void setTriggeredAt(LocalDateTime triggeredAt) {
        this.triggeredAt = triggeredAt;
    }
}
