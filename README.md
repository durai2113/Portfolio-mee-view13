# 🌌 Aravindh | Software Developer Portfolio

A premium, futuristic, and high-performance portfolio website. This project features a **FastAPI** backend, **MongoDB Atlas** integration, and an **AI-powered assistant (Gemini AI)** to create a truly immersive and functional personal showcase.

---

## 🚀 Key Features

- **Cyber Midnight Theme**: A stunning, neon-accented dark mode with a professional "Premium Snow" light mode toggle.
- **ARA-Bot (AI Assistant)**: Integrated Gemini AI bot to answer visitor questions about my skills and projects in real-time.
- **Full Horizon Footer**: A custom, edge-to-edge neon footer designed for immersive visual impact.
- **Secure Admin Dashboard**: Restricted access to view and manage contact form messages.
- **Glassmorphism UI**: Modern transparency effects, sleek gradients, and scroll-reveal animations.
- **SMTP Integration**: Automated email notifications when a visitor sends a message.

---

## �️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System), JavaScript (ES6+).
- **Backend**: Python (FastAPI), Uvicorn.
- **Database**: MongoDB Atlas (NoSQL).
- **AI Engine**: Google Gemini Pro (via Generative AI SDK).
- **Communication**: SMTP (Email Notifications).

---

## 📁 Project Structure

```text
.
├── index.html          # Main Entrance
├── assets/             # Images & Documents
├── css/                # Stylesheets (styles.css)
├── js/                 # JavaScript logic (main.js)
├── backend/            # FastAPI Backend Application
│   ├── services/       # AI & Email Services
│   ├── config.py       # Configuration
│   ├── models.py       # Pydantic Schemas
│   ├── routes.py       # API Endpoints
│   └── main.py         # App Factory & Static Mounting
├── database/           # Database Connection Logic
│   └── database.py     # MongoDB Connection & CRUD
├── server.py           # Production Launcher
└── render.yaml         # One-Click Deployment Config
```

---

## ⚙️ Local Setup

### 1. Prerequisites
- Python 3.10+
- A Google Gemini API Key
- A MongoDB Atlas Cluster

### 2. Installation
Clone the repository and install the dependencies:
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Database
MONGODB_URI=your_mongodb_uri
MONGODB_DB=portfolio_db
MONGODB_COLLECTION=contacts

# AI Assistant
GEMINI_API_KEY=your_gemini_api_key

# Admin Security
ADMIN_SECRET=your_password_here

# Email (SMTP)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_TO=where_you_want_notifs@gmail.com
```

### 4. Run Locally
```bash
python server.py
```
Open `http://localhost:5000` in your browser.

---

## 🌍 Deployment (Render.com)

This project is pre-configured for **Render**.

1.  Push your code to **GitHub**.
2.  Login to [Render.com](https://render.com) and create a **New Web Service**.
3.  Connect your repository.
4.  Render will automatically use the `render.yaml` settings.
5.  **Crucial**: Go to the "Environment" tab in Render and add all the keys from your `.env` file.

---

## 📡 API Endpoints

- `POST /api/contact`: Submits the contact form to MongoDB.
- `POST /api/chat`: Communicates with ARA-Bot (Gemini AI).
- `GET /api/contacts`: (Protected) Fetches messages for the Admin Dashboard.
- `POST /api/draft-reply`: (Protected) Uses AI to draft an email response.

---

**Crafted with ❤️ by Aravindh**  
*Building scalable solutions and high-performance digital experiences.*
