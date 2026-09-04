/* Inkwell — frontend API layer.
   Talks to the real Express + MongoDB backend from Module 2.
   Only the auth token and cached user name are kept in localStorage;
   all real data (users, posts) now lives in the database. */

const API_BASE = 'http://localhost:5000/api'; // change this to your deployed backend URL later

const SESSION = {
  token: 'inkwell_token',
  userName: 'inkwell_user_name'
};

function getToken() {
  return localStorage.getItem(SESSION.token);
}
function setSession(token, name) {
  localStorage.setItem(SESSION.token, token);
  localStorage.setItem(SESSION.userName, name);
}
function clearSession() {
  localStorage.removeItem(SESSION.token);
  localStorage.removeItem(SESSION.userName);
}
function isLoggedIn() {
  return !!getToken();
}
function getUserName() {
  return localStorage.getItem(SESSION.userName);
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }
  return data;
}

/* Call this at the top of any private page (Dashboard, Create Blog, Edit Post,
   Profile). It does a real server-side check — not just "is there a token in
   localStorage" — so an expired or tampered token gets bounced to Login even
   if something is still sitting in local storage. Returns the user object,
   or redirects and returns null. */
async function requireLogin() {
  if (!getToken()) {
    location.href = 'login.html';
    return null;
  }
  try {
    const user = await apiRequest('/auth/me');
    return user;
  } catch (err) {
    clearSession();
    location.href = 'login.html';
    return null;
  }
}

/* ---------- Nav highlighting + auth-aware links ---------- */
function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.site-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  const authSlot = document.querySelector('[data-auth-slot]');
  if (authSlot) {
    if (isLoggedIn()) {
      authSlot.innerHTML = `<a href="dashboard.html">Dashboard</a>
        <a href="profile.html">Profile</a>
        <a href="#" id="logoutLink">Log out</a>`;
      document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        clearSession();
        location.href = 'index.html';
      });
    } else {
      authSlot.innerHTML = `<a href="login.html">Log in</a>
        <a href="register.html">Register</a>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', initNav);
