# Smart Automatic Dog Feeder

A full-stack web and mobile-responsive application for controlling and scheduling dog feeding remotely via IoT (MQTT).

## Tech Stack
- **Frontend**: React.js with Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **IoT**: MQTT (using HiveMQ Cloud over WebSockets)
- **Database**: MongoDB (Local or Atlas)
- **Authentication**: JWT-based Auth (ready for Google Sign-In)

## Project Structure
- `/frontend`: React application (Vite-based)
- `/backend`: Node.js API and MQTT service

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 14+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or a cloud URI)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file (one has been created for you):
   - `MONGO_URI`: Your MongoDB connection string.
   - `MQTT_USERNAME` & `MQTT_PASSWORD`: Provided in the request.
4. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the application at [http://localhost:5173/](http://localhost:5173/)

---

## 🛠️ IoT Configuration
The app connects to the following MQTT broker:
- **URL**: `wss://57d98099abe74b37b2af2cc640b99e73.s1.eu.hivemq.cloud:8884/mqtt`
- **Topic (Feed)**: `dogfeeder/feed` (Message: `dispense`)
- **Topic (Status)**: `dogfeeder/status` (Device online/offline updates)

## 📱 Features
- **Dashboard**: Real-time status indicators (Online/Offline), last feeding, and food level.
- **Manual Feed**: One-tap food dispensation.
- **Schedules**: Create complex feeding times (e.g., Morning, Afternoon, Night).
- **Activity Logs**: Real-time message history from the device.
- **Responsiveness**: Fully optimized for mobile and desktop views.

## 📝 Modern UI
Designed with **Glassmorphism**, **Modern Typography**, and **Fluent Animations** for a premium user experience.
