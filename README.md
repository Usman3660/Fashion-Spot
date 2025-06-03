# Fashion-Spot

A modern e-commerce platform for fashion enthusiasts built with a microservices architecture. The application features user authentication, product browsing, and a responsive frontend experience.

Tech Stack
Frontend: React.js with Google OAuth integration
Backend: Microservices architecture with Express Gateway
Authentication: Dedicated auth-service for user management
API Gateway: Handles routing between services
Perfect for developers interested in microservices architecture, e-commerce applications, or fashion tech platforms.

How to Run Fashion Spot
Prerequisites
Node.js and npm installed
MongoDB (for auth and other services)
Setup and Installation
1. Gateway Service
   cd fashion-spot_Updated/gateway
   npm install
   npm start
The gateway will run on port 8080 and route requests to the appropriate microservices.

3. Auth Service
     cd fashion-spot_Updated/auth-service
     npm install
     npm start
5. Frontend
   cd fashion-spot_Updated/frontend
   npm install
   npm start
The React frontend will be available at http://localhost:3000
