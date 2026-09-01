/* Inkwell — shared data layer.
   Uses localStorage to fake a backend so the frontend is fully clickable
   before Module 2 (real backend + database) is built. */

const DB = {
  users: 'inkwell_users',
  session: 'inkwell_session',
  posts: 'inkwell_posts'
};

function getUsers() {
  return JSON.parse(localStorage.getItem(DB.users) || '[]');
}
function saveUsers(users) {
  localStorage.setItem(DB.users, JSON.stringify(users));
}
function getPosts() {
  return JSON.parse(localStorage.getItem(DB.posts) || '[]');
}
function savePosts(posts) {
  localStorage.setItem(DB.posts, JSON.stringify(posts));
}
function getSession() {
  return localStorage.getItem(DB.session);
}
function setSession(email) {
  localStorage.setItem(DB.session, email);
}
function clearSession() {
  localStorage.removeItem(DB.session);
}
function currentUser() {
  const email = getSession();
  if (!email) return null;
  return getUsers().find(u => u.email === email) || null;
}

/* Seed a couple of sample posts the first time the app runs,
   so Home doesn't look empty during a demo. */
(function seed() {
  if (!localStorage.getItem(DB.posts)) {
    savePosts([
      {
        id: 'seed-1',
        title: 'Why I started keeping a build log',
        content: 'Writing down what I build, even the small pieces, makes the next decision easier. This blog is that log, in public.',
        author: 'Sachin',
        date: '2026-08-28'
      },
      {
        id: 'seed-2',
        title: 'Setting up a local dev environment, finally done right',
        content: 'It took longer than expected to get formatting, linting, and hot reload all agreeing with each other, but the setup pays for itself by day two.',
        author: 'Sachin',
        date: '2026-08-30'
      }
    ]);
  }
})();

/* ---------- Nav highlighting + auth-aware links ---------- */
function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.site-nav a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  const authSlot = document.querySelector('[data-auth-slot]');
  if (authSlot) {
    const user = currentUser();
    if (user) {
      authSlot.innerHTML = `<a href="dashboard.html">Dashboard</a>
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
