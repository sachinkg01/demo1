# Inkwell Backend (Module 2 — Backend Development)

Node.js + Express REST API for the Inkwell blog app, backed by MongoDB.

## What's included

- **User Registration** — `POST /api/auth/register`
- **User Login** — `POST /api/auth/login`
- **Create Blog** — `POST /api/posts` (requires login)
- **List all posts** — `GET /api/posts` (public, used by the Home page)
- **List my posts** — `GET /api/posts/mine` (requires login, used by the Dashboard)
- **Delete a post** — `DELETE /api/posts/:id` (requires login, only your own posts)

Passwords are hashed with bcrypt before being stored — never saved as plain text.
Logging in returns a JWT (JSON Web Token) that the frontend stores and sends
with each request to prove who's logged in.

## 1. Set up MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account
2. Create a free "M0" cluster
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, click "Allow access from anywhere" (0.0.0.0/0) — fine for a student project
5. Click **Connect** → **Drivers** → copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 2. Configure the project

```bash
cd inkwell-backend
npm install
cp .env.example .env
```

Open `.env` and paste in your real connection string as `MONGO_URI`
(add `/inkwell` before the `?` so it uses a database named "inkwell"),
and set `JWT_SECRET` to any long random string.

## 3. Run the server

```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

## 4. Test the API directly (optional but recommended)

With the server running, in another terminal:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Sachin","email":"sachin@test.com","password":"secret123"}'

# Log in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sachin@test.com","password":"secret123"}'

# Copy the "token" from the login response, then create a post:
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PASTE_YOUR_TOKEN_HERE" \
  -d '{"title":"My first post","content":"Hello, Inkwell!"}'

# View all posts (no login needed)
curl http://localhost:5000/api/posts
```

If each of these returns data (not an error), your backend is working correctly.

## 5. Connect the frontend

The `inkwell-frontend` folder is already updated to call this backend
(see `script.js` → `API_BASE`). With the backend running on port 5000,
just open `index.html` in your browser — register, log in, and write a
post, and it will now be saved for real in MongoDB instead of the browser's
local storage.

## Folder structure

```
inkwell-backend/
├── models/
│   ├── User.js       # user schema (name, email, hashed password)
│   └── Post.js       # blog post schema
├── routes/
│   ├── auth.js        # register + login
│   └── posts.js       # create, list, delete posts
├── middleware/
│   └── auth.js         # checks the JWT on protected routes
├── server.js            # app entry point
├── .env.example         # template for your own .env (never commit real .env)
└── package.json
```
