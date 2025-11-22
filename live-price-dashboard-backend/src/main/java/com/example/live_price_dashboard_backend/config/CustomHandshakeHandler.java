package com.example.live_price_dashboard_backend.config;

import com.example.live_price_dashboard_backend.auth.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.security.Principal;
import java.util.Map;

@Component
public class CustomHandshakeHandler extends DefaultHandshakeHandler {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public CustomHandshakeHandler(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            
            // Get token from query parameter or header
            String token = getToken(httpRequest);
            
            if (token != null) {
                try {
                    // First validate the token structure
                    if (!jwtUtil.validateToken(token)) {
                        return null;
                    }
                    
                    // Then get username and validate with user details
                    String username = jwtUtil.extractUsername(token);
                    if (username != null) {
                        // Load user details
                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        
                        // Validate token with user details
                        if (jwtUtil.validateToken(token, userDetails)) {
                            // Create authentication
                            UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(
                                    userDetails, 
                                    null, 
                                    userDetails.getAuthorities()
                                );
                            
                            // Set authentication in security context
                            SecurityContextHolder.getContext().setAuthentication(authentication);
                            
                            // Return the authentication as principal
                            return authentication;
                        }
                    }
                } catch (Exception e) {
                    // Token validation failed
                    return null;
                }
            }
        }
        return null;
    }
    
    private String getToken(HttpServletRequest request) {
        // Try to get token from header first
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        
        // Try to get token from query parameter
        String token = request.getParameter("token");
        if (StringUtils.hasText(token)) {
            return token;
        }
        
        // Try to get token from the WebSocket sub-protocol header
        String protocolHeader = request.getHeader("Sec-WebSocket-Protocol");
        if (StringUtils.hasText(protocolHeader) && protocolHeader.startsWith("Bearer,")) {
            // Format is usually: "Bearer, [token]"
            String[] parts = protocolHeader.split(",");
            if (parts.length > 1) {
                return parts[1].trim();
            }
        }
        
        return null;
    }

}
