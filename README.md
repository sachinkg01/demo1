# Inkwell — Full-Stack Blog Application

A full-stack blog platform where users can register, log in, and publish, edit,
and delete their own posts. Built as a step-by-step internship project covering
frontend, backend, database integration, CRUD, authentication, and deployment.

**Live site:** _add your deployed frontend URL here_
**Backend API:** _add your deployed backend URL here_

## Features

- User registration and login with hashed passwords (bcrypt) and JWT sessions
- Create, read, update, and delete blog posts
- Search posts by keyword and filter by category
- Individual post detail pages
- Personal dashboard showing only your own posts
- Editable profile (change display name, change password)
- Fully responsive — works on mobile, tablet, and desktop

## Tech Stack

**Frontend:** HTML, CSS, JavaScript (no framework — vanilla `fetch` calls to the API)
**Backend:** Node.js, Express.js
**Database:** MongoDB (via Mongoose)
**Auth:** JSON Web Tokens (JWT) + bcrypt password hashing

## Project Structure

```
inkwell/
├── inkwell-frontend/     — static HTML/CSS/JS site
│   ├── index.html         (Home — list, search, filter posts)
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html     (your posts, edit/delete)
│   ├── create-blog.html
│   ├── edit-post.html
│   ├── post.html          (single post detail view)
│   ├── profile.html
│   ├── script.js           (shared API helper + auth logic)
│   └── style.css
│
└── inkwell-backend/       — REST API
    ├── models/             (User.js, Post.js)
    ├── routes/             (auth.js, posts.js)
    ├── middleware/         (auth.js — JWT verification)
    └── server.js
```

## API Reference

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in, returns a JWT |
| GET | `/api/auth/me` | Yes | Get your own profile |
| PUT | `/api/auth/me` | Yes | Update name and/or password |
| GET | `/api/posts` | No | List all posts (supports `?search=` and `?category=`) |
| GET | `/api/posts/meta/categories` | No | List available categories |
| GET | `/api/posts/mine` | Yes | List only your own posts |
| GET | `/api/posts/:id` | No | Get one post's full details |
| POST | `/api/posts` | Yes | Create a post |
| PUT | `/api/posts/:id` | Yes | Update your own post |
| DELETE | `/api/posts/:id` | Yes | Delete your own post |

## Running Locally

### 1. Backend
```bash
cd inkwell-backend
npm install
cp .env.example .env
# edit .env with your MongoDB Atlas connection string and a JWT secret
npm run dev
```
Full setup instructions (including creating a free MongoDB Atlas cluster) are
in `inkwell-backend/README.md`.

### 2. Frontend
Open `inkwell-frontend/index.html` directly in your browser, or serve it with
a simple local server (e.g. the VS Code "Live Server" extension) — either
works, since it's static HTML calling the backend over `fetch`.

By default, the frontend expects the backend at `http://localhost:5000/api`.
This is set in `inkwell-frontend/script.js`:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

## Deployment

This project deploys as two separate pieces: the backend (a real Node.js
server) and the frontend (static files).

### Deploy the backend — Render
1. Push this project to GitHub
2. Go to [render.com](https://render.com) → New → Web Service → connect your repo
3. Set **Root Directory** to `inkwell-backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add environment variables under "Environment": `MONGO_URI`, `JWT_SECRET`, and (after step below) `FRONTEND_URL`
7. Deploy — Render gives you a URL like `https://inkwell-backend.onrender.com`

### Deploy the frontend — Netlify
1. In `inkwell-frontend/script.js`, change `API_BASE` to your Render URL:
   ```javascript
   const API_BASE = 'https://inkwell-backend.onrender.com/api';
   ```
2. Go to [netlify.com](https://netlify.com) → Add new site → deploy manually,
   and drag in the `inkwell-frontend` folder (or connect the GitHub repo and
   set the **Publish directory** to `inkwell-frontend`)
3. Netlify gives you a URL like `https://inkwell-blog.netlify.app`
4. Go back to Render → your backend's environment variables → set
   `FRONTEND_URL` to that Netlify URL, so CORS allows it — then redeploy the backend

(Vercel works the same way as Netlify for the frontend, if you prefer it.)

### Verify
Visit your Netlify URL, register an account, and publish a post. If it saves
and shows up on Home, the two are talking to each other correctly.

## Author

Sachin
