# ⚡ Postman Lite — API Testing Platform

> A lightweight, browser-based API testing tool built for the Hackathon. Test APIs, manage collections, set environment variables, and inspect responses — all without installing anything extra.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen)](https://postman-lite.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-raju--pandit-blue)](https://github.com/raju-pandit/Postman-Lite)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://nodejs.org)

---

## 📌 Project Overview

**Postman Lite** is a full-stack API testing web application inspired by Postman. It allows developers to:
- Send HTTP requests (GET, POST, PUT, PATCH, DELETE) to any API
- Inspect responses with **syntax-highlighted JSON**
- Save requests in organized **Collections**
- Manage **Environment Variables** using `{{VAR}}` syntax
- Track **Request History** automatically
- Toggle between **Dark & Light Mode**

The backend acts as a **CORS proxy server**, allowing the frontend to call any external API without browser CORS restrictions.

All data is stored in **browser localStorage** — no database required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚀 **HTTP Methods** | GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS |
| 📋 **Request Builder** | Params, Headers, Body (JSON / form-data / urlencoded / raw), Auth |
| 🔐 **Authentication** | Bearer Token, Basic Auth, API Key |
| 🌍 **Environment Variables** | `{{BASE_URL}}` style variable resolution |
| 📁 **Collections** | Save, organize, and reload requests |
| 🕓 **Request History** | Auto-tracks last 20 sent requests |
| 🎨 **JSON Highlighting** | Color-coded response body |
| 🌙 **Dark / Light Mode** | Theme toggle, saved in localStorage |
| 📡 **CORS Proxy** | Backend proxy bypasses CORS restrictions |
| 📊 **Response Meta** | Status Code, Response Time (ms), Size (KB) |
| 📄 **Copy Response** | One-click copy to clipboard |

---

## 🗂️ Folder Structure

```
Postman-Lite/
│
├── backend/                    # Node.js + Express backend
│   ├── routes/
│   │   └── proxy.js            # CORS proxy route (Axios)
│   ├── server.js               # Express server + Demo APIs
│   └── package.json
│
├── frontend/                   # Vanilla JS + HTML + CSS
│   ├── css/
│   │   └── style.css           # Premium dark theme
│   ├── js/
│   │   ├── app.js              # Main wiring & event listeners
│   │   ├── auth.js             # Auth header management
│   │   ├── collections.js      # Collections CRUD (localStorage)
│   │   ├── environment.js      # {{VAR}} resolver
│   │   ├── request.js          # Request builder + smart routing
│   │   └── response.js         # Response renderer + JSON highlighter
│   └── index.html              # Main app shell
│
├── screenshots/                # UI screenshots
├── package.json                # Root package (for deployment)
├── .gitignore
└── README.md
```

---

## 🛠️ Technologies Used

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web server and routing |
| **Axios** | Proxying HTTP requests |
| **CORS** | Cross-origin support |

### Frontend
| Technology | Purpose |
|---|---|
| **HTML5** | App structure |
| **Vanilla CSS** | Custom dark/light theme |
| **Vanilla JavaScript** | All UI logic, no frameworks |
| **localStorage** | Collections, History, Env Variables |
| **Google Fonts** | Inter + JetBrains Mono |

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v16+

### Step 1 — Clone
```bash
git clone https://github.com/raju-pandit/Postman-Lite.git
cd Postman-Lite
```

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start server
```bash
npm start
```

### Step 4 — Open browser
```
http://localhost:5000
```

> ✅ Frontend is served automatically by Express — no separate server needed!

---

## 📡 Built-in Demo APIs

The server includes ready-to-use demo endpoints for testing:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/movies` | Get all movies list |
| `GET` | `/movies/:id` | Get single movie by ID |
| `POST` | `/movies` | Add a new movie |
| `GET` | `/users` | Get all users |
| `GET` | `/api/status` | Server health check |

### Example — Test with Postman Lite:
```
GET  https://postman-lite.onrender.com/movies
GET  https://postman-lite.onrender.com/users
GET  https://postman-lite.onrender.com/api/status
```

### POST /movies — Request Body (JSON):
```json
{
  "title": "Pushpa 2",
  "year": 2024,
  "genre": "Action",
  "rating": 8.5,
  "director": "Sukumar"
}
```

---

## 🔄 Application Workflow

```
User fills URL + Method + Headers/Body/Auth
           │
           ▼
   Frontend — request.js
   Smart Routing:
   ┌────────────────────────────────┐
   │  localhost URL?                │
   │  → Direct fetch (user's PC)   │
   │  External URL?                 │
   │  → Render Proxy (CORS bypass) │
   └────────────────────────────────┘
           │
           ▼
   Response rendered with:
   ✅ JSON Syntax Highlighting
   ✅ Status / Time / Size chips
   ✅ Auto-saved to History
```

---

## 💾 localStorage Keys

| Key | Contents |
|---|---|
| `pl_collections` | Saved request collections |
| `pl_history` | Last 20 sent requests |
| `pl_env_vars` | Environment variable pairs |
| `pl_theme` | `"dark"` or `"light"` |

---

## 🎯 How to Use

### Send a Request
1. Enter URL: `https://postman-lite.onrender.com/movies`
2. Select method: `GET`
3. Click **Send**
4. View the JSON response with syntax highlighting ✅

### Environment Variables
1. Click **🌐 Environments**
2. Add: `BASE_URL = https://postman-lite.onrender.com`
3. Use in URL: `{{BASE_URL}}/movies`

### Save to Collection
1. Click **💾 Save**
2. Enter name → Select collection → **Save Request**

### Dark / Light Mode
- Click ☀️/🌙 button in navbar

---

## 📸 Screenshots

### 🌑 Dark Mode
![Dark Mode](./screenshots/dark-mode.png)

### ☀️ Light Mode
![Light Mode](./screenshots/light-mode.png)

### 📡 Response Viewer
![Response](./screenshots/response-view.png)

### 🏗️ Architecture
![Architecture](./screenshots/architecture.png)

---

## 👨‍💻 Author

**Raju Pandit** — Built for Hackathon 2026

---

## 📄 License

Open source for educational and hackathon purposes.
