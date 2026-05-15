# ☕ Cafe-System: QuickPrint QR Management

A premium, production-ready MERN stack dashboard for modern cafes to manage document print workflows via QR-based uploads.

## 🚀 Live Deployment (Render)

This project is optimized for deployment on [Render](https://render.com). Follow these steps to take your system live:

### 1. Repository Link
**URL**: `https://github.com/Dehardal/Cafe-System.git`

### 2. Backend Setup (Web Service)
- **Service Type**: Web Service
- **Environment**: Node
- **Build Command**: `cd backend && npm install`
- **Start Command**: `npm start` (Make sure you are in the `backend` directory)
- **Environment Variables**:
  - `MONGO_URI`: Your MongoDB Atlas connection string
  - `JWT_SECRET`: A secure random string for authentication
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render will override this, but good to have)
  - `FRONTEND_URL`: Your final Render Frontend URL (e.g., `https://cafe-system.onrender.com`)

### 3. Frontend Setup (Static Site)
- **Service Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` (This will be inside the `frontend` folder)
- **Environment Variables**:
  - `VITE_API_URL`: Your live Render Backend URL + `/api` (e.g., `https://cafe-backend.onrender.com/api`)
  - `VITE_SOCKET_URL`: Your live Render Backend URL (e.g., `https://cafe-backend.onrender.com`)

## ✨ Features

- **🚀 Instant QR Uploads**: Customers can scan a unique shop QR to upload PDFs, images, and text files instantly.
- **📊 Live Analytics**: Real-time business intelligence tracking revenue, print volume, and peak hours.
- **🖨️ Active Print Queue**: A "Cockpit-Style" dashboard for owners to manage, preview, and process jobs in real-time.
- **🔐 Secure Edit Flow**: Settings are locked by default to prevent accidental changes, requiring an explicit "Edit" action to unlock.
- **📱 Premium UI**: High-density "Master-Control" layout with a professional "Premium Light" theme and glassmorphic depth.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, Framer Motion, TailwindCSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (GridFS for binary-safe file storage).
- **Real-time**: Socket.io for instant job notifications.

## 📄 License
MIT License - Developed by Dehardal
