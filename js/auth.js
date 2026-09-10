/* ==========================================================================
   Reabetswe Technologies — learner profiles
   Client-side demo storage (browser localStorage). Good enough for a
   portfolio / static-hosted build; swap for a real backend + database
   before handling genuine learner data. See README for notes.
   ========================================================================== */

var RT_LEARNERS_KEY = 'rt_learners';
var RT_SESSION_KEY = 'rt_session';

var RTAuth = {
  getLearners: function () {
    try { return JSON.parse(localStorage.getItem(RT_LEARNERS_KEY)) || []; }
    catch (e) { return []; }
  },
  saveLearners: function (list) {
    localStorage.setItem(RT_LEARNERS_KEY, JSON.stringify(list));
  },
  findByUsername: function (username) {
    return this.getLearners().find(function (l) {
      return l.username.toLowerCase() === username.toLowerCase();
    });
  },
  createProfile: function (data) {
    var learners = this.getLearners();
    if (this.findByUsername(data.username)) {
      return { ok: false, error: 'That username is already taken. Try another one.' };
    }
    var modules = ['IT & Internet Basics', 'HTML Foundations', 'CSS Styling', 'JavaScript Logic', 'Intro to Python'];
    var learner = {
      id: 'ln_' + Date.now(),
      fullName: data.fullName,
      age: data.age,
      username: data.username,
      password: data.password, // demo only — never store plain-text passwords in production
      parentEmail: data.parentEmail,
      classFormat: data.classFormat,
      joined: new Date().toISOString(),
      progress: modules.reduce(function (acc, m) { acc[m] = 0; return acc; }, {}),
      badges: []
    };
    learners.push(learner);
    this.saveLearners(learners);
    this.setSession(learner.username);
    return { ok: true, learner: learner };
  },
  login: function (username, password) {
    var learner = this.findByUsername(username);
    if (!learner || learner.password !== password) {
      return { ok: false, error: 'Username or password is incorrect.' };
    }
    this.setSession(learner.username);
    return { ok: true, learner: learner };
  },
  setSession: function (username) { localStorage.setItem(RT_SESSION_KEY, username); },
  logout: function () { localStorage.removeItem(RT_SESSION_KEY); },
  currentLearner: function () {
    var username = localStorage.getItem(RT_SESSION_KEY);
    if (!username) return null;
    return this.findByUsername(username) || null;
  },
  updateProgress: function (username, moduleName, value) {
    var learners = this.getLearners();
    var learner = learners.find(function (l) { return l.username === username; });
    if (!learner) return;
    learner.progress[moduleName] = value;
    this.saveLearners(learners);
  }
};

document.addEventListener('DOMContentLoaded', function () {

  /* ---- profile creation form (profile.html) ---- */
  var signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      if (signupForm.querySelector('.has-error')) return; // main.js validation runs first via bubbling order
    });
  }

  /* Hook used by main.js's generic validator (data-onvalid="handleSignup") */
  window.handleSignup = function (form) {
    var data = {
      fullName: form.fullName.value.trim(),
      age: form.age.value.trim(),
      username: form.username.value.trim(),
      password: form.password.value,
      parentEmail: form.parentEmail.value.trim(),
      classFormat: form.querySelector('input[name="classFormat"]:checked') ? form.querySelector('input[name="classFormat"]:checked').value : 'online'
    };
    var result = RTAuth.createProfile(data);
    var msgBox = document.getElementById('signup-message');
    if (!result.ok) {
      if (msgBox) { msgBox.textContent = result.error; msgBox.style.color = '#D7263D'; }
      return;
    }
    if (msgBox) { msgBox.textContent = ''; }
    window.location.href = 'dashboard.html';
  };

  window.handleLogin = function (form) {
    var username = form.loginUsername.value.trim();
    var password = form.loginPassword.value;
    var result = RTAuth.login(username, password);
    var msgBox = document.getElementById('login-message');
    if (!result.ok) {
      if (msgBox) { msgBox.textContent = result.error; msgBox.style.color = '#D7263D'; }
      return;
    }
    window.location.href = 'dashboard.html';
  };

  /* ---- registration (parent enrolment) form (register.html) ---- */
  window.handleEnrolment = function (form) {
    var enrolments = JSON.parse(localStorage.getItem('rt_enrolments') || '[]');
    enrolments.push({
      id: 'en_' + Date.now(),
      childName: form.childName.value.trim(),
      childAge: form.childAge.value.trim(),
      parentName: form.parentName.value.trim(),
      parentEmail: form.parentEmail.value.trim(),
      parentPhone: form.parentPhone.value.trim(),
      classFormat: form.querySelector('input[name="format"]:checked') ? form.querySelector('input[name="format"]:checked').value : '',
      experience: form.experience.value,
      submitted: new Date().toISOString()
    });
    localStorage.setItem('rt_enrolments', JSON.stringify(enrolments));
  };

  /* ---- contact form ---- */
  window.handleContact = function (form) {
    var messages = JSON.parse(localStorage.getItem('rt_messages') || '[]');
    messages.push({
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      submitted: new Date().toISOString()
    });
    localStorage.setItem('rt_messages', JSON.stringify(messages));
  };

  /* ---- dashboard rendering (dashboard.html) ---- */
  var dash = document.querySelector('[data-dashboard]');
  if (dash) {
    var learner = RTAuth.currentLearner();
    if (!learner) {
      window.location.href = 'profile.html';
      return;
    }
    document.querySelectorAll('[data-learner-name]').forEach(function (el) { el.textContent = learner.fullName; });
    document.querySelectorAll('[data-learner-age]').forEach(function (el) { el.textContent = learner.age; });
    document.querySelectorAll('[data-learner-format]').forEach(function (el) {
      el.textContent = learner.classFormat === 'physical' ? 'Saturday physical classes' : 'Online, self-paced';
    });
    document.querySelectorAll('[data-learner-initial]').forEach(function (el) { el.textContent = learner.fullName.charAt(0).toUpperCase(); });

    var moduleWrap = document.getElementById('module-progress');
    if (moduleWrap) {
      moduleWrap.innerHTML = '';
      Object.keys(learner.progress).forEach(function (moduleName) {
        var pct = learner.progress[moduleName];
        var row = document.createElement('div');
        row.style.marginBottom = '20px';
        row.innerHTML =
          '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-weight:600;color:var(--navy);font-family:var(--font-head);font-size:0.92rem;">' +
          '<span>' + moduleName + '</span><span>' + pct + '%</span></div>' +
          '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
        moduleWrap.appendChild(row);
      });
    }

    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function () {
        RTAuth.logout();
        window.location.href = 'index.html';
      });
    }

    var bumpBtns = document.querySelectorAll('[data-bump-module]');
    bumpBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var m = btn.getAttribute('data-bump-module');
        var current = learner.progress[m] || 0;
        var next = Math.min(100, current + 20);
        RTAuth.updateProgress(learner.username, m, next);
        window.location.reload();
      });
    });

    /* dashboard tab nav */
    var navBtns = document.querySelectorAll('.dash-nav button');
    var panels = document.querySelectorAll('.dash-panel');
    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        navBtns.forEach(function (b) { b.classList.remove('active'); });
        panels.forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-panel')).classList.add('active');
      });
    });
  }

  /* ---- nav: reflect logged-in state ---- */
  var learnerNow = RTAuth.currentLearner();
  document.querySelectorAll('[data-auth-slot]').forEach(function (slot) {
    if (learnerNow) {
      slot.innerHTML = '<a href="dashboard.html" class="btn btn-primary">Hi, ' + learnerNow.fullName.split(' ')[0] + '</a>';
    }
  });
});
