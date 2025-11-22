package com.example.live_price_dashboard_backend.services;

import com.example.live_price_dashboard_backend.models.PriceData;
import com.example.live_price_dashboard_backend.models.Watchlist;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class PriceService {
    
    private static final String PRICE_KEY_PREFIX = "price:";
    private static final String HISTORICAL_KEY_PREFIX = "history:";
    private static final Duration CACHE_DURATION = Duration.ofSeconds(10);
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    @Autowired
    private ExternalPriceAPI externalPriceAPI;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public PriceData getCurrentPrice(String symbol, Watchlist.SymbolType symbolType) {
        String cacheKey = PRICE_KEY_PREFIX + symbol;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        
        if (cached != null) {
            try {
                return objectMapper.readValue(cached, PriceData.class);
            } catch (JsonProcessingException e) {
                // Cache corrupted, fetch fresh data
            }
        }
        
        // Fetch from external API
        PriceData priceData = fetchFromExternalAPI(symbol, symbolType);
        
        // Cache the result
        try {
            String jsonData = objectMapper.writeValueAsString(priceData);
            redisTemplate.opsForValue().set(cacheKey, jsonData, CACHE_DURATION);
            
            // Store in historical data
            String historyKey = HISTORICAL_KEY_PREFIX + symbol;
            redisTemplate.opsForList().rightPush(historyKey, jsonData);
            redisTemplate.expire(historyKey, Duration.ofHours(24)); // Keep 24 hours of history
            
        } catch (JsonProcessingException e) {
            // Log error but continue
        }
        
        return priceData;
    }
    
    public List<PriceData> getHistoricalPrices(String symbol, int hours) {
        String historyKey = HISTORICAL_KEY_PREFIX + symbol;
        List<String> historicalData = redisTemplate.opsForList().range(historyKey, -hours, -1);
        
        List<PriceData> prices = new ArrayList<>();
        if (historicalData != null) {
            for (String data : historicalData) {
                try {
                    prices.add(objectMapper.readValue(data, PriceData.class));
                } catch (JsonProcessingException e) {
                    // Skip corrupted data
                }
            }
        }
        
        return prices;
    }
    
    public List<PriceData> getPricesForSymbols(List<String> symbols, List<Watchlist.SymbolType> symbolTypes) {
        List<PriceData> prices = new ArrayList<>();
        
        for (int i = 0; i < symbols.size(); i++) {
            String symbol = symbols.get(i);
            Watchlist.SymbolType symbolType = symbolTypes.get(i);
            prices.add(getCurrentPrice(symbol, symbolType));
        }
        
        return prices;
    }
    
    private PriceData fetchFromExternalAPI(String symbol, Watchlist.SymbolType symbolType) {
        if (symbolType == Watchlist.SymbolType.CRYPTO) {
            return externalPriceAPI.fetchCryptoPrice(symbol);
        } else {
            return externalPriceAPI.fetchStockPrice(symbol);
        }
    }
    
    public void clearCache(String symbol) {
        String cacheKey = PRICE_KEY_PREFIX + symbol;
        redisTemplate.delete(cacheKey);
    }
    
    public void clearAllCache() {
        // This is a simplified version - in production you might want to use Redis SCAN
        // For demo purposes, we'll just clear common symbols
        String[] commonSymbols = {"BTC", "ETH", "AAPL", "GOOGL", "MSFT", "TSLA"};
        for (String symbol : commonSymbols) {
            clearCache(symbol);
        }
    }
}
