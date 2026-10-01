/* ==========================================================================
   Reabetswe Technologies — Backend Auth API (Node.js/Express simulation)
   
   This is a simplified backend reference. For production, use:
   - bcryptjs or argon2 for password hashing
   - A real database (PostgreSQL, MongoDB)
   - HTTPS and secure session/JWT tokens
   - Rate limiting and CSRF protection
   ========================================================================== */

const crypto = require('crypto');

// Simulated database (replace with real DB in production)
let learners = [];

// Simple hash function (DO NOT USE IN PRODUCTION – use bcryptjs)
function simpleHash(password) {
  return crypto.createHash('sha256').update(password + 'salt_reabetswe').digest('hex');
}

function findByUsername(username) {
  if (!username || typeof username !== 'string') return null;
  return learners.find(l => l && l.username && l.username.toLowerCase() === username.toLowerCase());
}

function createProfile(data) {
  // Validate input
  if (!data || !data.username || !data.password || !data.fullName || !data.age) {
    return { ok: false, error: 'Missing required fields.' };
  }

  if (findByUsername(data.username)) {
    return { ok: false, error: 'That username is already taken. Try another one.' };
  }

  const modules = [
    'IT & Internet Basics',
    'HTML Foundations',
    'CSS Styling',
    'JavaScript Logic',
    'Intro to Python'
  ];

  const learner = {
    id: 'ln_' + Date.now(),
    fullName: String(data.fullName).trim(),
    age: parseInt(data.age, 10),
    username: String(data.username).trim(),
    passwordHash: simpleHash(data.password), // NEVER store plain text
    parentEmail: String(data.parentEmail || '').trim(),
    classFormat: data.classFormat || 'online',
    joined: new Date().toISOString(),
    progress: modules.reduce((acc, m) => {
      acc[m] = 0;
      return acc;
    }, {}),
    badges: []
  };

  // Validate age
  if (isNaN(learner.age) || learner.age < 10 || learner.age > 16) {
    return { ok: false, error: 'Age must be between 10 and 16.' };
  }

  learners.push(learner);

  // Return learner data WITHOUT password
  return {
    ok: true,
    learner: {
      id: learner.id,
      fullName: learner.fullName,
      age: learner.age,
      username: learner.username,
      classFormat: learner.classFormat
    }
  };
}

function login(username, password) {
  if (!username || !password) {
    return { ok: false, error: 'Username and password are required.' };
  }

  const learner = findByUsername(username);
  if (!learner || learner.passwordHash !== simpleHash(password)) {
    return { ok: false, error: 'Username or password is incorrect.' };
  }

  // Return learner data WITHOUT password
  return {
    ok: true,
    learner: {
      id: learner.id,
      fullName: learner.fullName,
      age: learner.age,
      username: learner.username,
      classFormat: learner.classFormat
    }
  };
}

function updateProgress(username, moduleName, value) {
  if (!username || typeof username !== 'string') return false;

  const learner = learners.find(l => l && l.username === username);
  if (!learner) return false;

  learner.progress[moduleName] = Math.max(0, Math.min(100, parseInt(value, 10)));
  return true;
}

module.exports = {
  createProfile,
  login,
  updateProgress,
  findByUsername
};
