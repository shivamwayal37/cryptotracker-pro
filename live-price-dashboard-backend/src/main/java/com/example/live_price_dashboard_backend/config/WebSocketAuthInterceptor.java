package com.example.live_price_dashboard_backend.config;

import com.example.live_price_dashboard_backend.auth.JwtUtil;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public WebSocketAuthInterceptor(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = extractToken(accessor);
            
            if (token == null) {
                throw new MessageDeliveryException("No authentication token provided");
            }
            
            try {
                // First extract username to check if token is valid
                String username = jwtUtil.extractUsername(token);
                if (username == null) {
                    throw new MessageDeliveryException("Invalid token: No username found");
                }
                
                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails == null) {
                    throw new MessageDeliveryException("User not found: " + username);
                }
                
                // Now validate the token with user details
                if (!jwtUtil.validateToken(token, userDetails)) {
                    throw new MessageDeliveryException("Invalid or expired token");
                }
                
                // Create and set authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, 
                        null, 
                        userDetails.getAuthorities()
                );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
                accessor.setUser(authentication);
                
            } catch (Exception e) {
                // Log the error and throw an exception to reject the connection
                throw new MessageDeliveryException("WebSocket authentication failed: " + e.getMessage());
            }
        }
        
        return message;
    }

    private String extractToken(StompHeaderAccessor accessor) {
        // Try to get token from Authorization header first
        String bearerToken = accessor.getFirstNativeHeader("Authorization");
        if (StringUtils.hasText(bearerToken)) {
            if (bearerToken.startsWith("Bearer ")) {
                return bearerToken.substring(7);
            }
            // If it doesn't start with Bearer, try using it as is (might be from WebSocket URL)
            return bearerToken;
        }
        
        // Check query parameters from the WebSocket URL
        String query = accessor.getFirstNativeHeader("query");
        if (query != null) {
            // Handle URL-encoded query parameters
            query = java.net.URLDecoder.decode(query, java.nio.charset.StandardCharsets.UTF_8);
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    return param.substring(6);
                }
            }
        }
        
        // Try to get from the native headers map directly
        Map<String, List<String>> nativeHeaders = accessor.toNativeHeaderMap();
        if (nativeHeaders != null) {
            // Check for token in headers (case-insensitive)
            for (Map.Entry<String, List<String>> entry : nativeHeaders.entrySet()) {
                if ("token".equalsIgnoreCase(entry.getKey()) && !entry.getValue().isEmpty()) {
                    return entry.getValue().get(0);
                }
            }
            List<String> tokenParams = nativeHeaders.get("token");
            if (tokenParams != null && !tokenParams.isEmpty()) {
                return tokenParams.get(0);
            }
        }
        
        return null;
    }
}
