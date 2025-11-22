package com.example.live_price_dashboard_backend.controllers;

import com.example.live_price_dashboard_backend.models.PriceData;
import com.example.live_price_dashboard_backend.models.Watchlist;
import com.example.live_price_dashboard_backend.services.PriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
@CrossOrigin(origins = "*")
public class PriceController {
    
    @Autowired
    private PriceService priceService;
    
    @GetMapping("/{symbol}")
    public ResponseEntity<PriceData> getCurrentPrice(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "CRYPTO") Watchlist.SymbolType symbolType) {
        
        PriceData priceData = priceService.getCurrentPrice(symbol, symbolType);
        return ResponseEntity.ok(priceData);
    }
    
    @GetMapping("/{symbol}/history")
    public ResponseEntity<List<PriceData>> getHistoricalPrices(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "24") int hours) {
        
        List<PriceData> historicalData = priceService.getHistoricalPrices(symbol, hours);
        return ResponseEntity.ok(historicalData);
    }
    
    @GetMapping("/batch")
    public ResponseEntity<List<PriceData>> getBatchPrices(
            @RequestParam List<String> symbols,
            @RequestParam(defaultValue = "CRYPTO") List<Watchlist.SymbolType> symbolTypes) {
        
        if (symbols.size() != symbolTypes.size()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<PriceData> prices = priceService.getPricesForSymbols(symbols, symbolTypes);
        return ResponseEntity.ok(prices);
    }
    
    @DeleteMapping("/cache/{symbol}")
    public ResponseEntity<String> clearCache(@PathVariable String symbol) {
        priceService.clearCache(symbol);
        return ResponseEntity.ok("Cache cleared for " + symbol);
    }
    
    @DeleteMapping("/cache")
    public ResponseEntity<String> clearAllCache() {
        priceService.clearAllCache();
        return ResponseEntity.ok("All cache cleared");
    }
    
    // WebSocket message handlers
    @MessageMapping("/subscribe/{symbol}")
    @SendTo("/topic/prices/{symbol}")
    public PriceData subscribeToPrice(@PathVariable String symbol) {
        // This will be handled by the WebSocket service
        return null;
    }
}
