package com.example.live_price_dashboard_backend.services;

import com.example.live_price_dashboard_backend.models.PriceData;
import com.example.live_price_dashboard_backend.models.Watchlist;
import com.example.live_price_dashboard_backend.repositories.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class PriceFetcher {
    
    @Autowired
    private PriceService priceService;
    
    @Autowired
    private WatchlistRepository watchlistRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private AlertService alertService;
    
    @Scheduled(fixedRate = 5000) // Every 5 seconds
    @Transactional
    public void fetchAndUpdatePrices() {
        try {
            // Get all unique symbols from watchlists
            List<String> allSymbols = watchlistRepository.findAll().stream()
                .map(Watchlist::getSymbol)
                .distinct()
                .toList();
            
            for (String symbol : allSymbols) {
                // Get symbol type (assuming crypto for demo, in production you'd store this)
                Watchlist.SymbolType symbolType = determineSymbolType(symbol);
                
                // Fetch current price
                PriceData newPrice = priceService.getCurrentPrice(symbol, symbolType);
                
                // Send real-time update via WebSocket
                messagingTemplate.convertAndSend("/topic/prices/" + symbol, newPrice);
                
                // Check alerts for this symbol
                alertService.checkAlerts(symbol, newPrice);
            }
            
            // Send general price update to all subscribers
            messagingTemplate.convertAndSend("/topic/prices", "Price update completed");
            
        } catch (Exception e) {
            // Log error but don't stop the scheduler
            System.err.println("Error in price fetcher: " + e.getMessage());
        }
    }
    
    private Watchlist.SymbolType determineSymbolType(String symbol) {
        // Simple heuristic - in production this would be stored in the database
        String[] cryptoSymbols = {"BTC", "ETH", "ADA", "DOT", "LINK", "LTC", "BCH", "XLM", "UNI", "AAVE"};
        for (String crypto : cryptoSymbols) {
            if (crypto.equalsIgnoreCase(symbol)) {
                return Watchlist.SymbolType.CRYPTO;
            }
        }
        return Watchlist.SymbolType.STOCK;
    }
    
    // Manual trigger for testing
    public void triggerPriceUpdate(String symbol) {
        Watchlist.SymbolType symbolType = determineSymbolType(symbol);
        PriceData newPrice = priceService.getCurrentPrice(symbol, symbolType);
        messagingTemplate.convertAndSend("/topic/prices/" + symbol, newPrice);
        alertService.checkAlerts(symbol, newPrice);
    }
}
