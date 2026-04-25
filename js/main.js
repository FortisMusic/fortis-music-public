/* ============================================================
   FORTIS MUSIC — main.js
   Auth (Supabase), SPA routing, navigation, toasts
   ============================================================ */

// ── SUPABASE CLIENT ─────────────────────────────────────────
const SUPABASE_URL = 'https://wexvxiidiusosjilfjg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleHZ4aWlkaWl1c29zamlsZmpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTQ1MDMsImV4cCI6MjA5MjU5MDUwM30.QKIlrINzAjHDRg0iJ8aKbhzChoGknphUbjpz_lDpOLQ';

// Import Supabase from CDN (loaded in app.html via <script type="module">)
// This file assumes window.supabase is available OR uses the global from CDN.

let db; // Supabase client instance

function initSupabase() {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  } else {
    console.error('Supabase CDN not loaded.');
  }
}

// ── APP STATE ────────────────────────────────────────────────
const AppState = {
  user: null,           // Supabase auth user
  profile: null,        // profiles table row
  currentPage: 'home',
};

// ── PAGE REGISTRY ────────────────────────────────────────────
// Maps route slug → page element ID (and optional loader fn)
const PAGES = {
  home:     { id: 'page-home',    label: 'Home' },
  now:      { id: 'page-now',     label: 'Now Live' },
  discover: { id: 'page-discover',label: 'Discover' },
  dance:    { id: 'page-dance',   label: 'Dance Clubs' },
  studio:   { id: 'page-studio',  label: 'Music Studio' },
  clubs:    { id: 'page-clubs',   label: 'Clubs' },
  events:   { id: 'page-events',  label: 'Events' },
  gear:     { id: 'page-gear',    label: 'Gear Store' },
  about:    { id: 'page-about',   label: 'About' },
  contact:  { id: 'page-contact', label: 'Contact' },
  // Auth-protected
  profile:  { id: 'page-profile', label: 'My Profile', protected: true },
};

// ── ROUTER ───────────────────────────────────────────────────
function navigateTo(slug, pushState = true) {
  const page = PAGES[slug];
  if (!page) return;

  // Guard protected routes
  if (page.protected && !AppState.user) {
    openModal('modal-auth');
    return;
  }

  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target
  const el = document.getElementById(page.id);
  if (el) el.classList.add('active');

  // Update nav active state
  document.querySelectorAll('[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === slug);
  });

  AppState.currentPage = slug;

  // Update URL hash (no server-side routing needed on Netlify static)
  if (pushState) history.pushState({ slug }, '', `#${slug}`);

  // Close mobile menu
  document.getElementById('mobile-menu')?.classList.remove('open');

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Page-specific loaders
  if (typeof PAGE_LOADERS !== 'undefined' && PAGE_LOADERS[slug]) {
    PAGE_LOADERS[slug]();
  }
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  const slug = e.state?.slug || location.hash.replace('#', '') || 'home';
  navigateTo(slug, false);
});

// ── AUTH ─────────────────────────────────────────────────────
async function signUp({ email, password, fullName, role }) {
  if (!db) return { error: { message: 'Database not initialized' } };

  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role }
    }
  });
  if (error) return { error };

  // Create profile row
  if (data.user) {
    await db.from('profiles').insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    });
  }

  return { data };
}

async function signIn({ email, password }) {
  if (!db) return { error: { message: 'Database not initialized' } };
  return await db.auth.signInWithPassword({ email, password });
}

async function signOut() {
  if (!db) return;
  await db.auth.signOut();
  AppState.user = null;
  AppState.profile = null;
  updateNavForAuth();
  showToast('Signed out successfully', 'info');
  navigateTo('home');
}

async function loadProfile(userId) {
  if (!db) return;
  const { data } = await db.from('profiles').select('*').eq('id', userId).single();
  AppState.profile = data;
}

// Called on Supabase auth state change
async function onAuthChange(event, session) {
  if (session?.user) {
    AppState.user = session.user;
    await loadProfile(session.user.id);
    updateNavForAuth();
  } else {
    AppState.user = null;
    AppState.profile = null;
    updateNavForAuth();
  }

  // Hide page loader on first auth check
  const loader = document.getElementById('page-loader');
  if (loader) loader.classList.add('hidden');
}

// ── NAV AUTH STATE ───────────────────────────────────────────
function updateNavForAuth() {
  const loginBtn  = document.getElementById('nav-login-btn');
  const userMenu  = document.getElementById('nav-user-menu');
  const userInit  = document.getElementById('nav-user-initial');
  const userRole  = document.getElementById('nav-user-role');

  if (AppState.user) {
    if (loginBtn)  loginBtn.style.display  = 'none';
    if (userMenu)  userMenu.style.display  = 'flex';

    const name = AppState.profile?.full_name || AppState.user.email;
    const role = AppState.profile?.role || 'fan';
    if (userInit) userInit.textContent = name.charAt(0).toUpperCase();
    if (userRole) userRole.textContent = role;
  } else {
    if (loginBtn)  loginBtn.style.display  = '';
    if (userMenu)  userMenu.style.display  = 'none';
  }
}

// ── MODAL SYSTEM ─────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('open');
    // focus first input
    const inp = el.querySelector('input');
    if (inp) setTimeout(() => inp.focus(), 80);
  }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
    document.getElementById('user-dropdown')?.classList.remove('open');
  }
});

// ── AUTH MODAL LOGIC ─────────────────────────────────────────
function switchAuthTab(tab) {
  const loginTab  = document.getElementById('auth-tab-login');
  const signupTab = document.getElementById('auth-tab-signup');
  const loginForm = document.getElementById('auth-form-login');
  const signupForm = document.getElementById('auth-form-signup');
  const errorEl   = document.getElementById('auth-error');

  if (errorEl) errorEl.textContent = '';

  if (tab === 'login') {
    loginTab?.classList.add('active');
    signupTab?.classList.remove('active');
    loginForm?.classList.add('active');
    signupForm?.classList.remove('active');
  } else {
    signupTab?.classList.add('active');
    loginTab?.classList.remove('active');
    signupForm?.classList.add('active');
    loginForm?.classList.remove('active');
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('login-email')?.value.trim();
  const password = document.getElementById('login-password')?.value;
  const errorEl  = document.getElementById('auth-error');
  const btn      = document.getElementById('login-submit');

  if (!email || !password) {
    if (errorEl) errorEl.textContent = 'Please fill in all fields.';
    return;
  }

  setButtonLoading(btn, true, 'Signing in…');
  const { error } = await signIn({ email, password });
  setButtonLoading(btn, false, 'Sign In');

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    return;
  }

  closeModal('modal-auth');
  showToast('Welcome back! 🎵', 'success');
}

async function handleSignup(e) {
  e.preventDefault();
  const fullName = document.getElementById('signup-name')?.value.trim();
  const email    = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value;
  const role     = document.getElementById('signup-role')?.value;
  const errorEl  = document.getElementById('auth-error');
  const btn      = document.getElementById('signup-submit');

  if (!fullName || !email || !password || !role) {
    if (errorEl) errorEl.textContent = 'Please fill in all fields.';
    return;
  }
  if (password.length < 6) {
    if (errorEl) errorEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  setButtonLoading(btn, true, 'Creating account…');
  const { error } = await signUp({ email, password, fullName, role });
  setButtonLoading(btn, false, 'Create Account');

  if (error) {
    if (errorEl) errorEl.textContent = error.message;
    return;
  }

  closeModal('modal-auth');
  showToast('Account created! Check your email to confirm. 🎉', 'success');
}

// ── UTILITIES ────────────────────────────────────────────────
function setButtonLoading(btn, loading, text) {
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> ${text}`
    : text;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function getInitialPage() {
  const hash = location.hash.replace('#', '');
  return PAGES[hash] ? hash : 'home';
}

// ── INIT ─────────────────────────────────────────────────────
async function initApp() {
  initSupabase();

  if (db) {
    // Listen for auth changes (this fires immediately with current session)
    db.auth.onAuthStateChange(onAuthChange);
  } else {
    // No DB — hide loader anyway
    const loader = document.getElementById('page-loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
  }

  // Wire up all [data-page] links
  document.querySelectorAll('[data-page]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(a.dataset.page);
    });
  });

  // Wire nav-specific buttons
  document.getElementById('nav-login-btn')?.addEventListener('click', () => openModal('modal-auth'));
  document.getElementById('btn-join-shield')?.addEventListener('click', () => openModal('modal-auth'));

  // Hamburger
  document.getElementById('nav-hamburger')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('open');
  });

  // User avatar dropdown
  document.getElementById('nav-avatar-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('user-dropdown')?.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    document.getElementById('user-dropdown')?.classList.remove('open');
  });

  // Sign out
  document.getElementById('btn-signout')?.addEventListener('click', signOut);

  // Auth tabs
  document.getElementById('auth-tab-login')?.addEventListener('click', () => switchAuthTab('login'));
  document.getElementById('auth-tab-signup')?.addEventListener('click', () => switchAuthTab('signup'));

  // Auth forms
  document.getElementById('auth-form-login')?.addEventListener('submit', handleLogin);
  document.getElementById('auth-form-signup')?.addEventListener('submit', handleSignup);

  // Modal close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });

  // Navigate to initial page
  navigateTo(getInitialPage(), false);
}

document.addEventListener('DOMContentLoaded', initApp);
