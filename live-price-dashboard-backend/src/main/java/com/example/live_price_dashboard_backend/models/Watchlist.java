package com.example.live_price_dashboard_backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist")
public class Watchlist {
    
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
    @Enumerated(EnumType.STRING)
    @Column(name = "symbol_type", nullable = false)
    private SymbolType symbolType;
    
    @Column(name = "added_at")
    private LocalDateTime addedAt;
    
    public enum SymbolType {
        CRYPTO, STOCK
    }
    
    public Watchlist() {
        this.addedAt = LocalDateTime.now();
    }
    
    public Watchlist(User user, String symbol, SymbolType symbolType) {
        this();
        this.user = user;
        this.symbol = symbol;
        this.symbolType = symbolType;
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
    
    public SymbolType getSymbolType() {
        return symbolType;
    }
    
    public void setSymbolType(SymbolType symbolType) {
        this.symbolType = symbolType;
    }
    
    public LocalDateTime getAddedAt() {
        return addedAt;
    }
    
    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
