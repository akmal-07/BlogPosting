# 📝 BlogSphere

A full-stack blogging platform built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend. BlogSphere allows users to register, log in, create posts with image uploads, interact with other users' profiles, and toggle between dark & light themes.

---

## 🚀 Live Demo

> Coming soon — deploy on Vercel (frontend) + Render (backend)

---

## 📸 Features

- 🔐 **User Authentication** — Register & Login with JWT-based auth and bcrypt password hashing
- 📝 **Create Posts** — Write blog posts with title, content, tags, and image uploads
- 🏠 **Home Feed** — Browse all posts from all users in a dynamic feed
- 👤 **User Profiles** — View any user's profile with their bio, avatar, and posts
- 📂 **My Posts** — View, manage, and delete your own posts
- ⚙️ **Settings** — Update your profile info, bio, and avatar
- 🌗 **Dark / Light Theme** — Global theme toggle persisted across the app
- 📱 **Responsive Design** — Works seamlessly on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19.x |
| Vite | 7.x |
| React Router DOM | 7.x |
| React DatePicker | 9.x |
| Vanilla CSS | — |

### Backend
| Technology | Version |
|---|---|
| Node.js | LTS |
| Express | 5.x |
| MongoDB + Mongoose | 9.x |
| JSON Web Token (JWT) | 9.x |
| bcryptjs | 3.x |
| CORS | 2.x |

---

## 📁 Project Structure

```
BlogPosting/
│
├── index.js                  # Express backend entry point
├── package.json              # Backend dependencies
├── seed.js                   # Database seeder script
│
├── models/
│   ├── User.js               # User schema (name, email, password, bio, avatar)
│   └── Post.js               # Post schema (title, content, image, tags, author)
│
└── react-app/                # Frontend (React + Vite)
    ├── index.html
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx            # Root component with routing
    │   ├── config.js          # API base URL config
    │   ├── contexts/          # React context (Auth, Theme)
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── RightSidebar.jsx
    │   │   ├── PostCreationBox.jsx
    │   │   └── ThemeToggle.jsx
    │   └── pages/
    │       ├── Home.jsx           # Main feed
    │       ├── Login_page.jsx     # Login
    │       ├── Regestration_page.jsx  # Register
    │       ├── CreatePost.jsx     # New post form
    │       ├── PostDetails.jsx    # Single post view
    │       ├── Profile.jsx        # User profile
    │       ├── MyPosts.jsx        # My posts management
    │       └── Settings.jsx       # Account settings
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- npm

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/GOHIT11/BlogPosting.git
cd BlogPosting
```

---

### 2️⃣ Backend Setup

```bash
# Install backend dependencies
npm install

# Start the backend server
npm start
```

> The backend runs on **http://localhost:3000** by default.

Make sure MongoDB is running locally, or update the connection string in `index.js` to point to your MongoDB Atlas URI.

---

### 3️⃣ Frontend Setup

```bash
cd react-app

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

> The frontend runs on **http://localhost:5173** by default.

---

### 4️⃣ Environment / Config

Update `react-app/src/config.js` with your backend URL if needed:

```js
// config.js
export const API_BASE_URL = "http://localhost:3000";
```

---

### 5️⃣ Seed the Database (Optional)

To populate your database with sample users and posts:

```bash
node seed.js
```

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and get JWT token |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create a new post |
| DELETE | `/api/posts/:id` | Delete a post |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/:id` | Update user profile |

---

## 🌗 Dark / Light Theme

BlogSphere supports a global theme toggle. The selected theme is persisted in `localStorage` and applied via CSS variables across all pages — including login, registration, home, profile, settings, and post creation.

---



## 👤 Authors

- **GOHIT11**  
  GitHub: [@GOHIT11](https://github.com/GOHIT11)  
  Role: Development 

- **akmal-07**  
  GitHub: [@akmal-07](https://github.com/akmal-07)  
  Role: Testing, Refactoring & Documentation  

- **saiharshagodavarthi**  
  GitHub: [@saiharshagodavarthi](https://github.com/saiharshagodavarthi)  
  Role: Project Lead  

- **pavanguvvala**  
  GitHub: [@pavanguvvala](https://github.com/pavanguvvala)  
  Role: Development  

---


> ⭐ If you like this project, give it a star on GitHub!
