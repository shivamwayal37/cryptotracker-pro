package com.example.live_price_dashboard_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    private final CustomHandshakeHandler customHandshakeHandler;

    public WebSocketConfig(
            WebSocketAuthInterceptor webSocketAuthInterceptor,
            CustomHandshakeHandler customHandshakeHandler) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
        this.customHandshakeHandler = customHandshakeHandler;
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory broker for topics and queues
        config.enableSimpleBroker("/topic", "/queue");
        // Set the application destination prefix
        config.setApplicationDestinationPrefixes("/app");
        // Set the user destination prefix for user-specific messages
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the /ws endpoint for WebSocket connections with SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .setHandshakeHandler(customHandshakeHandler)
                .withSockJS();
        
        // Register the same endpoint without SockJS for native WebSocket connections
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .setHandshakeHandler(customHandshakeHandler);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Add our interceptor for authentication
        registration.interceptors(webSocketAuthInterceptor);
    }
}
