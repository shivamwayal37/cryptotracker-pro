package com.example.live_price_dashboard_backend.controllers;

import com.example.live_price_dashboard_backend.models.Watchlist;
import com.example.live_price_dashboard_backend.repositories.WatchlistRepository;
import com.example.live_price_dashboard_backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {
    
    @Autowired
    private WatchlistRepository watchlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<List<Watchlist>> getUserWatchlist() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Watchlist> watchlist = watchlistRepository.findByUserId(user.getId());
        return ResponseEntity.ok(watchlist);
    }
    
    @PostMapping
    public ResponseEntity<Watchlist> addToWatchlist(@RequestBody WatchlistRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if already in watchlist
        if (watchlistRepository.existsByUserIdAndSymbol(user.getId(), request.getSymbol())) {
            return ResponseEntity.badRequest().build();
        }
        
        Watchlist watchlistItem = new Watchlist(user, request.getSymbol(), request.getSymbolType());
        Watchlist saved = watchlistRepository.save(watchlistItem);
        
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{symbol}")
    public ResponseEntity<String> removeFromWatchlist(@PathVariable String symbol) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        watchlistRepository.deleteByUserIdAndSymbol(user.getId(), symbol);
        return ResponseEntity.ok("Removed from watchlist");
    }
    
    @GetMapping("/symbols")
    public ResponseEntity<List<String>> getUserSymbols() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<String> symbols = watchlistRepository.findSymbolsByUserId(user.getId());
        return ResponseEntity.ok(symbols);
    }
    
    // Inner class for request
    public static class WatchlistRequest {
        private String symbol;
        private Watchlist.SymbolType symbolType;
        
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        
        public Watchlist.SymbolType getSymbolType() { return symbolType; }
        public void setSymbolType(Watchlist.SymbolType symbolType) { this.symbolType = symbolType; }
    }
}
