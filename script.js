/* MacroMag Foundation - script.js */
(function () {
  'use strict';

  /* ---------- mobile menu ---------- */
  var btn = document.getElementById('menuBtn');
  var nav = document.getElementById('mainNav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- application form (opens the visitor's mail app) ---------- */
  var applyForm = document.getElementById('applyForm');
  if (applyForm) {
    var msg = document.getElementById('formMsg');
    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = applyForm.elements;
      var name = f.name.value.trim();
      var email = f.email.value.trim();
      msg.className = 'form-msg';
      if (!name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        msg.textContent = 'Please enter your name and a valid e-mail address.';
        return;
      }
      var cert = applyForm.querySelector('input[name="cert"]:checked');
      var lines = [
        'Name and surname: ' + name,
        'Region: ' + f.region.value.trim(),
        'E-mail: ' + email,
        'Education level: ' + f.education.value.trim(),
        'English level: ' + f.english.value.trim(),
        'Date of birth: ' + f.dob.value,
        'Work place type: ' + f.work.value.trim(),
        'MacroMag Fundamentals Certificate: ' + (cert ? cert.value : ''),
        '',
        'Bio:',
        f.bio.value.trim()
      ];
      var href = 'mailto:macromagfoundation@gmail.com' +
        '?subject=' + encodeURIComponent('Job application - ' + name) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      msg.className = 'form-msg ok';
      msg.textContent = 'Opening your mail app - press send there to finish.';
      window.location.href = href;
    });
  }

  /* ---------- docs: articles + comments (localStorage, per browser) ---------- */
  var list = document.getElementById('articles');
  var form = document.getElementById('articleForm');
  if (list && form) {
    var KEY = 'macromag.articles.v1';
    var amsg = document.getElementById('articleMsg');

    function load() {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; }
      catch (err) { return []; }
    }
    function save(data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
      catch (err) { return false; }
    }
    function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text; /* textContent = no HTML injection */
      return n;
    }
    function fmt(ts) { return new Date(ts).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }); }

    function render() {
      var data = load();
      list.textContent = '';
      if (!data.length) {
        list.appendChild(el('p', 'empty', 'No articles yet. Be the first to add one above.'));
        return;
      }
      data.slice().reverse().forEach(function (a) {
        var box = el('article', 'article');
        var del = el('button', 'del', 'Delete');
        del.type = 'button';
        del.addEventListener('click', function () {
          if (!confirm('Delete this article from your browser?')) return;
          save(load().filter(function (x) { return x.id !== a.id; }));
          render();
        });
        box.appendChild(del);
        box.appendChild(el('h3', '', a.title));
        box.appendChild(el('p', 'by', 'by ' + a.author + ' \u00b7 ' + fmt(a.date)));
        box.appendChild(el('p', 'body', a.desc));

        var cs = el('div', 'comments');
        cs.appendChild(el('strong', '', 'Comments (' + a.comments.length + ')'));
        a.comments.forEach(function (c) {
          var cm = el('div', 'comment');
          var b = el('b', '', c.author);
          var t = el('time', '', fmt(c.date));
          cm.appendChild(b); cm.appendChild(t);
          cm.appendChild(el('div', '', c.text));
          cs.appendChild(cm);
        });

        var cf = el('form', 'cform');
        var ca = el('input'); ca.type = 'text'; ca.placeholder = 'Your name'; ca.maxLength = 60; ca.required = true;
        ca.setAttribute('aria-label', 'Your name');
        var ct = el('textarea'); ct.placeholder = 'Write a comment...'; ct.rows = 3; ct.maxLength = 1500; ct.required = true;
        ct.setAttribute('aria-label', 'Comment');
        var cb = el('button', '', 'Add comment'); cb.type = 'submit';
        cf.appendChild(ca); cf.appendChild(ct); cf.appendChild(cb);
        cf.addEventListener('submit', function (e) {
          e.preventDefault();
          var author = ca.value.trim(), text = ct.value.trim();
          if (!author || !text) return;
          var all = load();
          var target = all.filter(function (x) { return x.id === a.id; })[0];
          if (!target) return;
          target.comments.push({ author: author, text: text, date: Date.now() });
          save(all);
          render();
        });
        cs.appendChild(cf);
        box.appendChild(cs);
        list.appendChild(box);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var title = document.getElementById('a-title').value.trim();
      var author = document.getElementById('a-author').value.trim();
      var desc = document.getElementById('a-desc').value.trim();
      amsg.className = 'form-msg';
      if (!title || !author || !desc) {
        amsg.textContent = 'Please fill in the title, author name and description.';
        return;
      }
      var data = load();
      data.push({ id: uid(), title: title, author: author, desc: desc, date: Date.now(), comments: [] });
      if (!save(data)) {
        amsg.textContent = 'Could not save - your browser blocks local storage.';
        return;
      }
      form.reset();
      amsg.className = 'form-msg ok';
      amsg.textContent = 'Article published.';
      render();
    });

    render();
  }
})();
