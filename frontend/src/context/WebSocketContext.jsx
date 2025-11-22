import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client, Stomp } from '@stomp/stompjs';
import { useAuth } from './AuthContext';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [priceData, setPriceData] = useState({});
  const [alerts, setAlerts] = useState([]);
  const stompClient = useRef(null);
  const subscriptions = useRef(new Map());
  const reconnectTimeout = useRef(null);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
    }
    return () => {
      if (isAuthenticated) {
        disconnectWebSocket();
      }
    };
  }, [isAuthenticated]);


  const connectWebSocket = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No auth token available, not attempting WebSocket connection');
      return;
    }

    // Check if we already have a connection attempt in progress
    if (stompClient.current?.connected || stompClient.current?.active) {
      return;
    }

    // Create WebSocket URL with token as query parameter
    const wsUrl = new URL('ws://localhost:8080/ws');
    wsUrl.searchParams.append('token', token);
    
    stompClient.current = new Client({
      brokerURL: wsUrl.toString(),
      connectHeaders: {
        // Add token in both URL and header for maximum compatibility
        Authorization: `Bearer ${token}`,
      },
      // Disable SockJS for native WebSocket
      webSocketFactory: () => new WebSocket(wsUrl.toString()),
      // Debug logging
      debug: (str) => {
        if (str.toLowerCase().includes('error')) {
          console.error('STOMP Error:', str);
        } else if (process.env.NODE_ENV === 'development') {
          console.debug('STOMP:', str);
        }
      },
      // Reconnect with backoff
      reconnectDelay: 5000,
      // Heartbeats to keep the connection alive
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        // Resubscribe to any existing subscriptions
        const subscriptionsToRestore = new Map(subscriptions.current);
        subscriptions.current.clear();
        
        subscriptionsToRestore.forEach(({ destination, callback, type }) => {
          if (destination && callback) {
            if (type === 'price') {
              const symbol = destination.split('/').pop();
              subscribeToPrice(symbol, (data) => {
                // Re-apply the callback that updates the price data
                setPriceData(prev => ({
                  ...prev,
                  [symbol]: data
                }));
                if (typeof callback === 'function') {
                  callback(data);
                }
              });
            } else if (type === 'alert') {
              const username = destination.split('/')[2];
              subscribeToUserAlerts(username, (alert) => {
                // Re-apply the callback that updates the alerts
                setAlerts(prevAlerts => [...prevAlerts, alert]);
                if (typeof callback === 'function') {
                  callback(alert);
                }
              });
            } else {
              // Fallback for any other subscription types
              subscribeToTopic(destination, callback);
            }
          }
        });
      },
      onStompError: (frame) => {
        const errorMessage = frame.headers?.message || 'Unknown WebSocket error';
        console.error('Broker reported error:', errorMessage);
        
        // Handle authentication errors
        if (errorMessage.includes('JWT') || errorMessage.includes('authentication')) {
          console.error('Authentication error detected. Please log in again.');
          // Clear any existing reconnect attempts
          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
          }
          // Clear the invalid token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsConnected(false);
          // Redirect to login or show auth modal
          window.location.href = '/login';
          return;
        }

        // For other errors, log and attempt to reconnect
        console.error('WebSocket error details:', frame.body);
        if (!reconnectTimeout.current) {
          handleReconnect();
        }
      },
      onWebSocketClose: (event) => {
        console.warn('WebSocket connection closed:', event);
        setIsConnected(false);
        handleReconnect();
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      }
    });

    stompClient.current.activate();
  };

  const handleReconnect = () => {
    if (!reconnectTimeout.current) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No auth token available, cannot reconnect WebSocket');
        return;
      }
      
      console.log('Scheduling WebSocket reconnection in 5 seconds...');
      reconnectTimeout.current = setTimeout(() => {
        reconnectTimeout.current = null;
        connectWebSocket();
      }, 5000);
    }
  };

  const disconnectWebSocket = () => {
    if (stompClient.current) {
      try {
        // Only try to deactivate if we have an active connection
        if (stompClient.current.connected || stompClient.current.active) {
          stompClient.current.deactivate().then(() => {
            console.log('WebSocket client deactivated');
          }).catch(error => {
            console.error('Error deactivating WebSocket:', error);
          });
        }
      } catch (error) {
        console.error('Error during WebSocket deactivation:', error);
      } finally {
        setIsConnected(false);
        // Clear any existing reconnect attempts
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
          reconnectTimeout.current = null;
        }
      }
    }
  };

  const subscribeToTopic = (destination, callback) => {
    if (!stompClient.current || !stompClient.current.connected) {
      console.warn('WebSocket not connected, subscription queued');
      return () => {};
    }

    // Clean up existing subscription if it exists
    const existingSub = subscriptions.current.get(destination);
    if (existingSub) {
      if (typeof existingSub.unsubscribe === 'function') {
        try {
          existingSub.unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from topic:', destination, err);
        }
      }
      subscriptions.current.delete(destination);
    }

    try {
      const subscription = stompClient.current.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          if (typeof callback === 'function') {
            callback(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Only store the subscription if it's valid
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscriptions.current.set(destination, subscription);
        
        // Return cleanup function
        return () => {
          try {
            if (subscription && typeof subscription.unsubscribe === 'function') {
              subscription.unsubscribe();
            }
          } catch (err) {
            console.error('Error in subscription cleanup:', err);
          } finally {
            subscriptions.current.delete(destination);
          }
        };
      } else {
        console.error('Invalid subscription object received for destination:', destination);
        return () => {};
      }
    } catch (error) {
      console.error('Error subscribing to topic:', destination, error);
      return () => {};
    }
  };

  const subscribeToPrice = (symbol, callback) => {
    const destination = `/topic/prices/${symbol}`;
    
    // Store the callback for reconnection
    const subscriptionKey = `price_${destination}`;
    
    // Create a wrapper callback that updates the price data
    const priceUpdateCallback = (data) => {
      setPriceData(prev => ({
        ...prev,
        [symbol]: data
      }));
      if (typeof callback === 'function') {
        callback(data);
      }
    };

    // Store the callback for reconnection
    subscriptions.current.set(subscriptionKey, { 
      destination, 
      callback: priceUpdateCallback,
      type: 'price'
    });

    // If connected, subscribe immediately
    if (stompClient.current?.connected) {
      const unsubscribe = subscribeToTopic(destination, priceUpdateCallback);
      
      // Return cleanup function
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
        subscriptions.current.delete(subscriptionKey);
      };
    }
    
    // Return a no-op cleanup function if not connected
    return () => {
      subscriptions.current.delete(subscriptionKey);
    };
  };

  const subscribeToUserAlerts = (username, callback) => {
    const destination = `/user/${username}/queue/alerts`;
    const subscriptionKey = `alert_${username}`;
    
    // Create a wrapper callback that updates the alerts
    const alertCallback = (alert) => {
      setAlerts(prevAlerts => [...prevAlerts, alert]);
      if (typeof callback === 'function') {
        callback(alert);
      }
    };

    // Store the callback for reconnection
    subscriptions.current.set(subscriptionKey, { 
      destination, 
      callback: alertCallback,
      type: 'alert'
    });

    // If connected, subscribe immediately
    if (stompClient.current?.connected) {
      const unsubscribe = subscribeToTopic(destination, alertCallback);
      
      // Return cleanup function
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
        subscriptions.current.delete(subscriptionKey);
      };
    }
    
    // Return a no-op cleanup function if not connected
    return () => {
      subscriptions.current.delete(subscriptionKey);
    };
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const value = {
    isConnected,
    priceData,
    alerts,
    subscribeToPrice,
    subscribeToUserAlerts,
    clearAlerts,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
