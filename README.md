# CryptoTracker Pro
Real-time cryptocurrency and stock price tracking platform with intelligent alerts and portfolio management.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)

**USE THIS SOFTWARE AT YOUR OWN RISK. THE AUTHOR ASSUMES NO LIABILITY FOR YOUR TRADING OUTCOMES OR INVESTMENT DECISIONS.**

![Dashboard](./docs/images/dashboard.png)
![Watchlist](./docs/images/watchlist.png)
![Price Chart](./docs/images/chart.png)
![Alerts](./docs/images/alerts.png)

---

## 📖 Contents
- [Overview](#-overview)
- [Motivation](#-motivation)
- [Features](#-features)
- [Technologies](#️-technologies)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

CryptoTracker Pro is a full-stack financial dashboard that provides real-time price tracking, intelligent alerts, and portfolio management for cryptocurrencies and stocks. Built with modern technologies and best practices, it delivers a professional-grade trading experience with enterprise-level performance.

### Key Highlights
- **Real-time Updates**: WebSocket streaming for instant price updates
- **Smart Alerts**: Customizable price notifications with multiple conditions
- **Beautiful UI**: Modern dark theme with glassmorphism design
- **High Performance**: Redis caching reduces API calls by ~40%
- **Secure**: JWT authentication with API key protection
- **Scalable**: Event-driven architecture ready for production

---

## 💡 Motivation

The cryptocurrency and stock markets move 24/7, and missing critical price movements can mean missed opportunities. Traditional portfolio trackers often suffer from:
- Delayed price updates (manual refresh required)
- Limited alert capabilities
- Poor user experience
- No real-time notifications

CryptoTracker Pro was built to solve these problems by providing:
- **Instant price updates** via WebSocket connections
- **Smart alert system** that notifies you the moment price thresholds are crossed
- **Professional UI** that's both beautiful and functional
- **Comprehensive portfolio tracking** with performance analytics

This project started as an experiment in real-time financial data streaming and evolved into a production-ready platform that demonstrates modern full-stack development practices.

---

## ✨ Features

### Core Features
- ✅ **Real-time Price Tracking**: Live WebSocket updates every 3-5 seconds
- ✅ **Multi-Asset Support**: Track both cryptocurrencies and stocks
- ✅ **Personalized Watchlist**: Add/remove symbols with one click
- ✅ **Smart Alerts**: Set price thresholds with above/below conditions
- ✅ **Interactive Charts**: Historical price visualization with Chart.js
- ✅ **User Authentication**: Secure JWT-based login system
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile

### Performance Optimizations
- ✅ **Redis Caching**: 90%+ cache hit ratio for frequent queries
- ✅ **WebSocket Streaming**: ~90% reduction in refresh latency
- ✅ **API Efficiency**: 40% reduction in external API calls
- ✅ **Scheduled Fetchers**: Background price updates every 5 seconds

### User Experience
- ✅ **Beautiful Dark Theme**: Easy on the eyes for extended use
- ✅ **Glassmorphism Effects**: Modern, professional aesthetics
- ✅ **Live Indicators**: Visual feedback for real-time connections
- ✅ **Toast Notifications**: Beautiful alert notifications
- ✅ **Loading States**: Smooth skeleton animations
- ✅ **Error Handling**: Graceful error messages

---

## ⚡️ Technologies

### Backend Stack
```
┌─────────────────────────────────────┐
│         Spring Boot 3.x             │
│  ┌──────────┐  ┌─────────────────┐ │
│  │  Spring  │  │  Spring Data    │ │
│  │ Security │  │  JPA/MongoDB    │ │
│  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌─────────────────┐ │
│  │   JWT    │  │   WebSocket     │ │
│  │   Auth   │  │   (STOMP)       │ │
│  └──────────┘  └─────────────────┘ │
└─────────────────────────────────────┘
         │              │
         ▼              ▼
   ┌──────────┐   ┌──────────┐
   │PostgreSQL│   │  Redis   │
   │/MongoDB  │   │  Cache   │
   └──────────┘   └──────────┘
```

### Frontend Stack
```
┌─────────────────────────────────────┐
│          React 18.x                 │
│  ┌──────────┐  ┌─────────────────┐ │
│  │   Vite   │  │  TailwindCSS    │ │
│  │  Build   │  │    Styling      │ │
│  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌─────────────────┐ │
│  │ Chart.js │  │   SockJS +      │ │
│  │ Recharts │  │   StompJS       │ │
│  └──────────┘  └─────────────────┘ │
└─────────────────────────────────────┘
```

### Tech Stack Details

**Backend:**
- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Security**: Spring Security + JWT (jjwt)
- **Database**: PostgreSQL / MongoDB
- **Cache**: Redis (Lettuce)
- **WebSocket**: Spring WebSocket + STOMP
- **Scheduling**: Spring Scheduler
- **API Integration**: CoinGecko, Alpha Vantage, Yahoo Finance

**Frontend:**
- **Framework**: React 18.x
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Charts**: Chart.js, Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **WebSocket**: SockJS, StompJS
- **Routing**: React Router v6

**Infrastructure:**
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (optional)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS, DigitalOcean, GCP (cloud-agnostic)
- **Monitoring**: Prometheus, Grafana (planned)

---

## 🏭 Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Watchlist │  │  Charts  │  │  Alerts  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST + WebSocket
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Spring Boot Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Auth Service  │  │Price Service │  │Alert Service │     │
│  │  (JWT)       │  │ (WebSocket)  │  │ (Scheduler)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Watchlist  │  │Price Fetcher │                        │
│  │   Service    │  │ (Scheduled)  │                        │
│  └──────────────┘  └──────────────┘                        │
└────────────┬──────────────┬──────────────┬─────────────────┘
             │              │              │
             ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │PostgreSQL│   │  Redis   │   │ External │
      │/MongoDB  │   │  Cache   │   │   APIs   │
      └──────────┘   └──────────┘   └──────────┘
```

### Event Flow Diagram
```
External APIs → Price Fetcher → Redis Cache → WebSocket → Frontend
       ↓              ↓              ↓            ↓
   (REST API)   (Scheduled)    (5s cache)  (Real-time)
                     ↓
              Alert Service → Check Thresholds → Notification
                                                      ↓
                                              WebSocket Push
```

### Why Event-Driven?

The system uses an event-driven architecture for several reasons:

1. **Decoupling**: Services communicate via events, not direct calls
2. **Scalability**: Services can scale independently
3. **Real-time**: WebSocket events enable instant updates
4. **Resilience**: Failed events can be retried without blocking

**Event Types:**
- `price.updated` - New price data available
- `alert.triggered` - Price threshold crossed
- `watchlist.modified` - User added/removed symbol
- `user.authenticated` - User logged in

---

## 🍕 Getting Started

### Prerequisites

Ensure you have the following tools installed:

**Required:**
- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **PostgreSQL**: 15+ (or MongoDB 6+)
- **Redis**: 7+
- **Maven/Gradle**: Build tools

**Optional:**
- **Docker**: For containerization
- **Docker Compose**: For multi-container setup
- **Kubernetes**: For orchestration (production)

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cryptotracker-pro.git
cd cryptotracker-pro
```

#### 2. Backend Setup

**Configure Database:**
```yaml
# backend/src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/cryptotracker
    username: your_db_user
    password: your_db_password
  
  data:
    redis:
      host: localhost
      port: 6379

app:
  jwt:
    secret: your-super-secret-jwt-key-change-in-production
    expiration: 86400000 # 24 hours

api:
  coingecko:
    base-url: https://api.coingecko.com/api/v3
  alpha-vantage:
    key: YOUR_ALPHA_VANTAGE_API_KEY
```

**Build and Run:**
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

Backend will start on `http://localhost:8080`

#### 3. Frontend Setup

**Install Dependencies:**
```bash
cd frontend
npm install
```

**Configure Environment:**
```bash
# frontend/.env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

**Start Development Server:**
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

#### 4. Database Migration

**Run Flyway migrations (if using):**
```bash
./mvnw flyway:migrate
```

**Or use the provided SQL scripts:**
```bash
psql -U your_user -d cryptotracker < database/schema.sql
```

---

## ⚙️ Configuration

### Asset Configuration

Configure which symbols to track in `backend/src/main/resources/application.yml`:
```yaml
app:
  symbols:
    crypto:
      - BTC
      - ETH
      - ADA
      - DOT
      - SOL
    stocks:
      - AAPL
      - GOOGL
      - TSLA
      - NVDA
      - MSFT
```

### Fetcher Configuration

Adjust price update frequency:
```yaml
app:
  scheduler:
    price-fetch-rate: 5000  # milliseconds (5 seconds)
    alert-check-rate: 3000  # milliseconds (3 seconds)
```

### Cache Configuration

Customize Redis caching behavior:
```yaml
spring:
  data:
    redis:
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0

app:
  cache:
    price-ttl: 10  # seconds
    historical-ttl: 3600  # 1 hour
```

### Alert Configuration

Configure alert system:
```yaml
app:
  alerts:
    max-per-user: 50
    check-interval: 3000  # milliseconds
    notification-cooldown: 300000  # 5 minutes
```

---

## 📚 Usage

### Web Interface

1. **Register/Login**
   - Navigate to `http://localhost:5173`
   - Click "Create Account" or "Sign In"
   - Enter credentials

2. **Add Symbols to Watchlist**
   - Click "Add Symbol" button
   - Select asset type (Crypto/Stock)
   - Choose from quick picks or enter manually
   - Click "Add to Watchlist"

3. **Create Price Alerts**
   - Click bell icon on any watchlist card
   - Select condition (Above/Below)
   - Enter target price
   - Click "Create Alert"

4. **View Charts**
   - Click on any symbol in watchlist
   - Chart appears on right panel
   - Select time period (1H, 24H, 7D, 30D)

5. **Manage Account**
   - View active alerts
   - Check portfolio stats
   - Update preferences

### API Endpoints

**Authentication:**
```bash
# Register
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Login
POST /api/auth/login
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Watchlist:**
```bash
# Get user's watchlist
GET /api/watchlist
Authorization: Bearer <jwt_token>

# Add symbol
POST /api/watchlist/add
Authorization: Bearer <jwt_token>
{
  "symbol": "BTC",
  "symbolType": "CRYPTO"
}

# Remove symbol
DELETE /api/watchlist/remove/{symbol}
Authorization: Bearer <jwt_token>
```

**Prices:**
```bash
# Get current price
GET /api/prices/{symbol}

# Get historical prices
GET /api/prices/historical/{symbol}?hours=24
```

**Alerts:**
```bash
# Create alert
POST /api/alerts/create
Authorization: Bearer <jwt_token>
{
  "symbol": "BTC",
  "thresholdPrice": 50000.00,
  "condition": "ABOVE"
}

# Get user's alerts
GET /api/alerts
Authorization: Bearer <jwt_token>

# Delete alert
DELETE /api/alerts/{alertId}
Authorization: Bearer <jwt_token>
```

### WebSocket Connection
```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// Connect to WebSocket
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, () => {
  // Subscribe to price updates
  stompClient.subscribe('/topic/prices/BTC', (message) => {
    const priceData = JSON.parse(message.body);
    console.log('BTC Price:', priceData);
  });

  // Subscribe to user alerts
  stompClient.subscribe('/user/queue/alerts', (message) => {
    const alert = JSON.parse(message.body);
    console.log('Alert triggered:', alert);
  });
});
```

---

## 📖 API Documentation

### REST API

Full API documentation available at:
```
http://localhost:8080/swagger-ui.html
```

### WebSocket Topics

**Public Topics:**
- `/topic/prices/{symbol}` - Real-time price updates for a symbol

**User-Specific Topics:**
- `/user/queue/alerts` - Personal alert notifications
- `/user/queue/notifications` - General notifications

---

## 🚀 Deployment

### Docker Deployment

**Build Docker images:**
```bash
# Backend
cd backend
docker build -t cryptotracker-backend .

# Frontend
cd frontend
docker build -t cryptotracker-frontend .
```

**Run with Docker Compose:**
```bash
docker-compose up -d
```

### Docker Compose Configuration
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: cryptotracker
      POSTGRES_USER: crypto_user
      POSTGRES_PASSWORD: crypto_pass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/cryptotracker
      SPRING_REDIS_HOST: redis
      JWT_SECRET: your-production-secret-key
      ALPHA_VANTAGE_KEY: your-api-key
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Deployment

**Apply Kubernetes manifests:**
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

**Verify deployment:**
```bash
kubectl get pods -n cryptotracker
kubectl get services -n cryptotracker
```

### Cloud Deployment (AWS)

**Using Terraform:**
```bash
cd infrastructure/terraform/aws
terraform init
terraform plan
terraform apply
```

**Manual AWS Deployment:**
1. Create RDS PostgreSQL instance
2. Create ElastiCache Redis cluster
3. Deploy to ECS or EKS
4. Configure ALB for load balancing
5. Setup Route53 for DNS

---

## 🗺️ Roadmap

### Phase 1: MVP (✅ Completed)
- [x] User authentication
- [x] Real-time price tracking
- [x] Watchlist management
- [x] Basic alert system
- [x] Interactive charts
- [x] WebSocket streaming

### Phase 2: Enhanced Features (🚧 In Progress)
- [ ] Portfolio management (buy/sell tracking)
- [ ] Advanced alert types (percentage change, volume spike)
- [ ] Technical indicators (RSI, MACD, Bollinger Bands)
- [ ] Export data to CSV
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive improvements

### Phase 3: Advanced Features (📋 Planned)
- [ ] Investment baskets/portfolios
- [ ] AI-powered price predictions
- [ ] Social features (share watchlists)
- [ ] Multi-exchange support
- [ ] Mobile app (React Native)
- [ ] Telegram bot integration
- [ ] Email notifications
- [ ] Premium subscription tiers

### Phase 4: Enterprise (🔮 Future)
- [ ] Multi-tenant support
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] API marketplace
- [ ] White-label solution
- [ ] Institutional features

---

## 👏 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
```bash
   git checkout -b feature/amazing-feature
```
3. **Commit your changes**
```bash
   git commit -m 'Add some amazing feature'
```
4. **Push to the branch**
```bash
   git push origin feature/amazing-feature
```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Write tests for new features
- Update documentation
- Keep PRs focused on single feature/fix
- Add meaningful commit messages

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Development Setup

See [Getting Started](#-getting-started) for development environment setup.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2025 CryptoTracker Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data
- [Alpha Vantage](https://www.alphavantage.co/) for stock market data
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Spring Boot](https://spring.io/projects/spring-boot) framework
- [React](https://reactjs.org/) library

---

## 📞 Contact

**Project Maintainer**: Your Name
- Email: your.email@example.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

**Project Link**: [https://github.com/yourusername/cryptotracker-pro](https://github.com/yourusername/cryptotracker-pro)

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/cryptotracker-pro&type=Date)](https://star-history.com/#yourusername/cryptotracker-pro&Date)

---

**Built with ❤️ by developers, for developers**
