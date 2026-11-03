# 🎨 StudioSpace

### A Full-Stack Studio Booking Platform

StudioSpace is a full-stack web application designed to help users explore studios and manage studio bookings through a modern web interface.

🌐 **Live Website:** https://studiospace-client-lime.vercel.app/

🖥️ **Backend API:** https://studiospace-server-ten.vercel.app/

---

## ✨ Features

- 🔐 User Authentication with Better Auth
- 🌐 Google OAuth Login Integration
- 📧 Email and Password Authentication
- 🎨 Studio Management API
- 📅 Booking Management API
- 🗄️ MongoDB Database Integration
- 👤 User and Session Management
- 📱 Responsive Frontend Interface
- 🚀 Separate Frontend and Backend Deployment

---

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth React Client

### Backend
- Node.js
- Express.js
- JavaScript
- Better Auth
- MongoDB Adapter
- CORS

### Database & Authentication
- MongoDB Atlas
- Better Auth
- Google OAuth 2.0

### Deployment
- Vercel (Frontend)
- Vercel (Backend)

---

## 📂 Project Structure

The project is maintained in two separate repositories.

### Frontend — `studiospace-client`

```text
studiospace-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── package.json
└── ...
```

### Backend — `studiospace-server`

```text
studiospace-server/
├── routes/
│   ├── bookingRoutes.js
│   └── studioRoutes.js
├── src/
│   ├── config/
│   │   └── database.js
│   └── auth.js
├── index.js
├── package.json
└── ...
```

---

## ⚙️ Installation & Setup

### 1. Clone the repositories

Clone your frontend and backend repositories separately from GitHub.

### 2. Setup Backend

```bash
cd studiospace-server
npm install
```

Create a `.env` file in the backend root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secure_secret
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Setup Frontend

```bash
cd studiospace-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:3000`

---

## 🔗 API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check server status |
| Various | `/api/studios` | Studio API routes |
| Various | `/api/bookings` | Booking API routes |
| Various | `/api/auth/*` | Better Auth endpoints |

---

## 🔑 Authentication

StudioSpace uses Better Auth for authentication.

- Email and Password Authentication
- Google OAuth 2.0
- MongoDB Database Adapter
- Session Management
- Trusted Frontend Origins

Google OAuth requires a valid Client ID, Client Secret and authorized redirect URI.

---

## 🗄️ Database

MongoDB Atlas is used as the database service.

The Better Auth MongoDB Adapter connects authentication data with MongoDB.

---

## 🌍 Deployment

| Application | Live URL |
|---|---|
| Frontend | https://studiospace-client-lime.vercel.app/ |
| Backend | https://studiospace-server-ten.vercel.app/ |

---

## 🔒 Environment Variables & Security

- Never upload `.env` or `.env.local` files to GitHub.
- Never expose MongoDB credentials.
- Never expose Google OAuth Client Secrets.
- Store production environment variables securely in Vercel.
- Use `.gitignore` to exclude sensitive files.

---

## 👩‍💻 Developer

**Swagata Mondal**

Diploma in Computer Engineering Student

GitHub: [@swagatamondalahona](https://github.com/swagatamondalahona)

---

⭐ If you find this project interesting, feel free to explore it!

**Built with passion and continuous learning.**