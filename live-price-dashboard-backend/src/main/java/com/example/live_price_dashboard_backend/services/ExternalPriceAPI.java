package com.example.live_price_dashboard_backend.services;

import com.example.live_price_dashboard_backend.models.PriceData;
import com.example.live_price_dashboard_backend.models.Watchlist;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class ExternalPriceAPI {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${api.coingecko.base-url:https://api.coingecko.com/api/v3}")
    private String coinGeckoBaseUrl;
    
    @Value("${api.alpha-vantage.key:demo}")
    private String alphaVantageKey;
    
    @Value("${api.alpha-vantage.base-url:https://www.alphavantage.co/query}")
    private String alphaVantageBaseUrl;
    
    public PriceData fetchCryptoPrice(String symbol) {
        try {
            // Map common crypto symbols to CoinGecko IDs
            String coinId = mapSymbolToCoinGeckoId(symbol);
            String url = coinGeckoBaseUrl + "/simple/price?ids=" + coinId + "&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true";
            
            String response = restTemplate.getForObject(url, String.class);
            return parseCoinGeckoResponse(symbol, response);
        } catch (Exception e) {
            // Return mock data for demo purposes
            return createMockPriceData(symbol, Watchlist.SymbolType.CRYPTO);
        }
    }
    
    public PriceData fetchStockPrice(String symbol) {
        try {
            String url = alphaVantageBaseUrl + "?function=GLOBAL_QUOTE&symbol=" + symbol + "&apikey=" + alphaVantageKey;
            
            String response = restTemplate.getForObject(url, String.class);
            return parseAlphaVantageResponse(symbol, response);
        } catch (Exception e) {
            // Return mock data for demo purposes
            return createMockPriceData(symbol, Watchlist.SymbolType.STOCK);
        }
    }
    
    private String mapSymbolToCoinGeckoId(String symbol) {
        Map<String, String> symbolMap = new HashMap<>();
        symbolMap.put("BTC", "bitcoin");
        symbolMap.put("ETH", "ethereum");
        symbolMap.put("ADA", "cardano");
        symbolMap.put("DOT", "polkadot");
        symbolMap.put("LINK", "chainlink");
        symbolMap.put("LTC", "litecoin");
        symbolMap.put("BCH", "bitcoin-cash");
        symbolMap.put("XLM", "stellar");
        symbolMap.put("UNI", "uniswap");
        symbolMap.put("AAVE", "aave");
        
        return symbolMap.getOrDefault(symbol.toUpperCase(), "bitcoin");
    }
    
    private PriceData parseCoinGeckoResponse(String symbol, String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        String coinId = mapSymbolToCoinGeckoId(symbol);
        JsonNode coinData = root.get(coinId);
        
        if (coinData != null) {
            BigDecimal price = new BigDecimal(coinData.get("usd").asText());
            BigDecimal change24h = new BigDecimal(coinData.get("usd_24h_change").asText());
            BigDecimal volume24h = new BigDecimal(coinData.get("usd_24h_vol").asText());
            BigDecimal marketCap = new BigDecimal(coinData.get("usd_market_cap").asText());
            
            return new PriceData(symbol, price, change24h, change24h, volume24h, marketCap, Watchlist.SymbolType.CRYPTO);
        }
        
        throw new RuntimeException("Failed to parse CoinGecko response");
    }
    
    private PriceData parseAlphaVantageResponse(String symbol, String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        JsonNode quote = root.get("Global Quote");
        
        if (quote != null) {
            BigDecimal price = new BigDecimal(quote.get("05. price").asText());
            BigDecimal change = new BigDecimal(quote.get("09. change").asText());
            BigDecimal changePercent = new BigDecimal(quote.get("10. change percent").asText().replace("%", ""));
            BigDecimal volume = new BigDecimal(quote.get("06. volume").asText());
            
            return new PriceData(symbol, price, change, changePercent, volume, null, Watchlist.SymbolType.STOCK);
        }
        
        throw new RuntimeException("Failed to parse Alpha Vantage response");
    }
    
    private PriceData createMockPriceData(String symbol, Watchlist.SymbolType symbolType) {
        // Generate mock data for demo purposes
        double basePrice = symbolType == Watchlist.SymbolType.CRYPTO ? 50000.0 : 150.0;
        double randomFactor = 0.8 + Math.random() * 0.4; // ±20% variation
        BigDecimal price = new BigDecimal(basePrice * randomFactor).setScale(2, BigDecimal.ROUND_HALF_UP);
        
        BigDecimal change24h = new BigDecimal((Math.random() - 0.5) * 10).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal changePercent24h = change24h.divide(price, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"));
        BigDecimal volume24h = new BigDecimal(Math.random() * 1000000).setScale(2, BigDecimal.ROUND_HALF_UP);
        BigDecimal marketCap = price.multiply(new BigDecimal("1000000")).setScale(2, BigDecimal.ROUND_HALF_UP);
        
        return new PriceData(symbol, price, change24h, changePercent24h, volume24h, marketCap, symbolType);
    }
}
