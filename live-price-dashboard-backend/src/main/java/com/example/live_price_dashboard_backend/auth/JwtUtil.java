package com.example.live_price_dashboard_backend.auth;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    
    @Value("${app.jwt.secret}")
    private String secret;
    
    @Value("${app.jwt.expiration}")
    private Long expiration;
    
    private static final String SECRET_KEY_PREFIX = "mySecretKey1234567890123456789012345678901234567890";
    
    @PostConstruct
    public void init() {
        // Use the secret from properties if available, otherwise use the default
        if (secret == null || secret.trim().isEmpty()) {
            secret = SECRET_KEY_PREFIX;
            logger.warn("Using default JWT secret key. For production, please set app.jwt.secret in application.yml");
        } else {
            logger.info("JwtUtil initialized with custom secret key");
        }
    }
    
    private SecretKey getSigningKey() {
        try {
            // Ensure the secret is at least 32 bytes long (required for HS256)
            byte[] keyBytes = secret.getBytes();
            if (keyBytes.length < 32) {
                // Pad with the default key if too short
                keyBytes = SECRET_KEY_PREFIX.getBytes();
            } else if (keyBytes.length > 64) {
                // Truncate if too long (max 64 bytes for HMAC-SHA-512)
                keyBytes = Arrays.copyOf(keyBytes, 64);
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            logger.error("Error creating signing key", e);
            throw new RuntimeException("Failed to create signing key", e);
        }
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            boolean isValid = (username != null && 
                             username.equals(userDetails.getUsername()) && 
                             !isTokenExpired(token) &&
                             validateTokenSignature(token));
            
            if (!isValid) {
                logger.warn("Token validation failed for user: {}", userDetails.getUsername());
            }
            return isValid;
        } catch (Exception e) {
            logger.error("Error validating token", e);
            return false;
        }
    }
    
    private boolean validateTokenSignature(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.error("Token signature validation failed: {}", e.getMessage());
            return false;
        }
    }
    
    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
