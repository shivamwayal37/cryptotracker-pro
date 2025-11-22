package com.example.live_price_dashboard_backend.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PriceData {
    
    private String symbol;
    private BigDecimal price;
    private BigDecimal change24h;
    private BigDecimal changePercent24h;
    private BigDecimal volume24h;
    private BigDecimal marketCap;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String currency = "USD";
    private Watchlist.SymbolType symbolType;
    
    public PriceData() {
        this.timestamp = LocalDateTime.now();
    }
    
    public PriceData(String symbol, BigDecimal price, Watchlist.SymbolType symbolType) {
        this();
        this.symbol = symbol;
        this.price = price;
        this.symbolType = symbolType;
    }
    
    public PriceData(String symbol, BigDecimal price, BigDecimal change24h, 
                    BigDecimal changePercent24h, BigDecimal volume24h, 
                    BigDecimal marketCap, Watchlist.SymbolType symbolType) {
        this(symbol, price, symbolType);
        this.change24h = change24h;
        this.changePercent24h = changePercent24h;
        this.volume24h = volume24h;
        this.marketCap = marketCap;
    }
    
    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }
    
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getChange24h() {
        return change24h;
    }
    
    public void setChange24h(BigDecimal change24h) {
        this.change24h = change24h;
    }
    
    public BigDecimal getChangePercent24h() {
        return changePercent24h;
    }
    
    public void setChangePercent24h(BigDecimal changePercent24h) {
        this.changePercent24h = changePercent24h;
    }
    
    public BigDecimal getVolume24h() {
        return volume24h;
    }
    
    public void setVolume24h(BigDecimal volume24h) {
        this.volume24h = volume24h;
    }
    
    public BigDecimal getMarketCap() {
        return marketCap;
    }
    
    public void setMarketCap(BigDecimal marketCap) {
        this.marketCap = marketCap;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public Watchlist.SymbolType getSymbolType() {
        return symbolType;
    }
    
    public void setSymbolType(Watchlist.SymbolType symbolType) {
        this.symbolType = symbolType;
    }
    
    @Override
    public String toString() {
        return "PriceData{" +
                "symbol='" + symbol + '\'' +
                ", price=" + price +
                ", change24h=" + change24h +
                ", changePercent24h=" + changePercent24h +
                ", volume24h=" + volume24h +
                ", marketCap=" + marketCap +
                ", timestamp=" + timestamp +
                ", currency='" + currency + '\'' +
                ", symbolType=" + symbolType +
                '}';
    }
}
