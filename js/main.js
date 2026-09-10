/* ==========================================================================
   Reabetswe Technologies — shared site behaviour
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- footer year ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- terminal typing animation (home hero) ---- */
  var typeTarget = document.querySelector('[data-typewriter]');
  if (typeTarget) {
    var lines = [
      { html: '<span class="c-key">print</span>(<span class="c-str">"Hello, future developer!"</span>)' },
      { html: '<span class="c-fn">learn</span>(<span class="c-str">"html"</span>, <span class="c-str">"css"</span>, <span class="c-str">"javascript"</span>)' },
      { html: '<span class="c-cm"># next module unlocks Saturday 10:00</span>' },
      { html: '<span class="c-key">if</span> kid.age <span class="c-key">in</span> range(10, 17):' },
      { html: '&nbsp;&nbsp;<span class="c-fn">enrol</span>(kid)  <span class="c-cm"># reabetswetech.co.za</span>' }
    ];
    var lineIndex = 0, charIndex = 0, out = document.createElement('div');
    typeTarget.innerHTML = '';
    typeTarget.appendChild(out);

    function typeNext() {
      if (lineIndex >= lines.length) return;
      var full = lines[lineIndex].html;
      // type by tag-aware chunks (split on tags so we don't chop entities)
      var plain = full.replace(/<[^>]+>/g, function (m) { return '\u0001' + m + '\u0001'; });
      var tokens = plain.split('\u0001').filter(Boolean);
      var rendered = '';
      var t = 0;

      function step() {
        if (t >= tokens.length) {
          lineIndex++;
          var div = document.createElement('div');
          div.innerHTML = rendered;
          out.appendChild(div);
          setTimeout(typeNext, 420);
          return;
        }
        var tok = tokens[t];
        if (tok.charAt(0) === '<') {
          rendered += tok;
          t++;
          step();
        } else {
          var i = 0;
          (function typeChar() {
            if (i < tok.length) {
              rendered += tok.charAt(i);
              i++;
              var div = document.createElement('div');
              div.innerHTML = rendered + '<span class="caret"></span>';
              out.innerHTML = '';
              out.appendChild(div);
              setTimeout(typeChar, 18);
            } else {
              t++;
              step();
            }
          })();
        }
      }
      step();
    }
    typeNext();
  }

  /* ---- gallery filters ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        galleryItems.forEach(function (item) {
          var match = cat === 'all' || item.getAttribute('data-category') === cat;
          item.classList.toggle('show', match);
        });
      });
    });
  }

  /* ---- generic form validation ---- */
  function showError(field, message) {
    field.classList.add('has-error');
    var err = field.querySelector('.error');
    if (err) err.textContent = message;
  }
  function clearError(field) {
    field.classList.remove('has-error');
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('.field[data-required]').forEach(function (field) {
        var input = field.querySelector('input, select, textarea');
        if (!input) return;
        var ok = true;

        if (input.type === 'checkbox') {
          ok = input.checked;
        } else if (field.hasAttribute('data-radio-group')) {
          var name = input.name;
          ok = !!form.querySelector('input[name="' + name + '"]:checked');
        } else {
          ok = input.value.trim().length > 0;
        }

        if (ok && input.type === 'email') {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if (ok && input.hasAttribute('data-min-age')) {
          var age = parseInt(input.value, 10);
          var min = parseInt(input.getAttribute('data-min-age'), 10);
          var max = parseInt(input.getAttribute('data-max-age'), 10);
          ok = !isNaN(age) && age >= min && age <= max;
        }
        if (ok && input.type === 'tel') {
          ok = input.value.trim().length >= 7;
        }

        if (!ok) { showError(field, field.getAttribute('data-error') || 'Please check this field.'); valid = false; }
        else { clearError(field); }
      });

      if (!valid) {
        var firstError = form.querySelector('.has-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var successBox = form.parentElement.querySelector('.form-success') || document.querySelector('.form-success');
      if (typeof form.dataset.onvalid === 'string' && window[form.dataset.onvalid]) {
        window[form.dataset.onvalid](form);
      }
      if (successBox) {
        successBox.classList.add('show');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
      galleryItems && form.querySelectorAll('.field').forEach(clearError);
    });
  });

});
