# ✦ Aurelia AI-Blog Summarizer

A full-stack MERN blog platform with AI-powered text summarization.
**Color Theme:** Deep Crimson · White · Gold

---

## 🚀 Quick Setup (VS Code)

### Prerequisites
- Node.js (v16 or higher) → https://nodejs.org
- MongoDB Community Server → https://www.mongodb.com/try/download/community
- VS Code → https://code.visualstudio.com

---

## Step 1 — Open Project in VS Code

1. Unzip the downloaded `aurelia-blog` folder
2. Open VS Code → File → Open Folder → select `aurelia-blog`
3. Open **two terminals** in VS Code (Terminal → New Terminal)

---

## Step 2 — Start MongoDB

Make sure MongoDB is running on your machine:
- **Windows:** MongoDB usually starts automatically, or open Services and start "MongoDB"
- **Mac:** Run `brew services start mongodb-community` in terminal
- **Or:** Just open MongoDB Compass and connect to `mongodb://localhost:27017`

---

## Step 3 — Setup & Run Backend

In **Terminal 1**:

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## Step 4 — Setup & Run Frontend

In **Terminal 2**:

```bash
cd frontend
npm install
npm start
```

This opens your browser at **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
aurelia-blog/
├── backend/
│   ├── models/
│   │   ├── User.js          ← User schema with password hashing
│   │   └── Blog.js          ← Blog schema with read-time calc
│   ├── routes/
│   │   ├── auth.js          ← Login, Signup, Get Me
│   │   └── blogs.js         ← Full CRUD + AI Summarize endpoint
│   ├── middleware/
│   │   └── auth.js          ← JWT protection middleware
│   ├── .env                 ← MongoDB URI & JWT secret
│   └── server.js            ← Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js        ← Sticky nav with auth state
        │   ├── BlogCard.js      ← Card with gold hover accent
        │   └── ProtectedRoute.js ← Route guard
        ├── context/
        │   └── AuthContext.js   ← Global auth state
        ├── pages/
        │   ├── Home.js          ← Blog listing, search, filter, pagination
        │   ├── Login.js         ← Login with validation
        │   ├── Signup.js        ← Signup with validation
        │   ├── CreateBlog.js    ← Blog editor with AI summarize button
        │   ├── EditBlog.js      ← Edit existing blog
        │   ├── BlogDetail.js    ← Full post view + summary toggle
        │   └── MyBlogs.js       ← Author's dashboard
        ├── utils/
        │   └── api.js           ← Axios instance with auth headers
        ├── App.js               ← Routes definition
        └── index.css            ← Global styles (crimson/white/gold theme)
```

---

## ✦ Features

| Feature | Details |
|---|---|
| **Authentication** | JWT-based login/signup with bcrypt password hashing |
| **Blog CRUD** | Create, read, update, delete with ownership protection |
| **AI Summarization** | Extractive summarization using TF-IDF scoring (no API key needed) |
| **Search & Filter** | Search by title/content/tags + category filter |
| **Pagination** | 9 blogs per page with page number navigation |
| **Protected Routes** | Only logged-in users can create/edit/delete |
| **Responsive** | Works on mobile, tablet, desktop |

---

## 🔧 Environment Variables

The `.env` file in `/backend` is pre-configured:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aurelia-blog
JWT_SECRET=aurelia_super_secret_jwt_key_2024
```

Change `JWT_SECRET` to something unique before deploying.

---

## 🎨 Design System

- **Primary:** Deep Crimson `#8B0000`
- **Accent:** Gold `#C9A84C`
- **Background:** Off-White `#FDF8F3`
- **Display Font:** Playfair Display (serif)
- **Body Font:** Inter (sans-serif)
