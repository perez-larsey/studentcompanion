/* ── STATE ── */
var userName = '';
var tasks   = [];
var classes = [];
var grades  = [];
var notes   = [];
var slides  = [];
var isDark  = false;
var showSat = false;
var showSun = false;

/* ── INIT ── */
window.onload = function () {
  loadFromStorage();

  isDark = localStorage.getItem('sc_dark') === 'true';
  if (isDark) {
    document.body.classList.add('dark');
    document.getElementById('themeBtn').textContent = '☀️';
  }

  showSat = localStorage.getItem('sc_showSat') === 'true';
  showSun = localStorage.getItem('sc_showSun') === 'true';
  document.getElementById('showSat').checked = showSat;
  document.getElementById('showSun').checked = showSun;

  setHeaderDate();
  renderAll();

  userName = localStorage.getItem('sc_name') || '';
  if (!userName) {
    document.getElementById('nameModal').classList.remove('hidden');
  } else {
    document.getElementById('nameModal').classList.add('hidden');
    setGreeting();
  }

  document.getElementById('nameInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') saveName();
  });
};

function renderAll() {
  renderTasks();
  renderTimetable();
  renderGrades();
  renderNotes();
  renderSlides();
  updateDashboard();
}

/* ── NAME & GREETING ── */
function saveName() {
  var val = document.getElementById('nameInput').value.trim();
  if (!val) { alert('Please enter your name.'); return; }
  userName = val;
  localStorage.setItem('sc_name', userName);
  document.getElementById('nameModal').classList.add('hidden');
  setGreeting();
}

function getGreeting() {
  var h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Good morning, ' + userName;
  if (h >= 12 && h < 17) return 'Good afternoon, ' + userName;
  if (h >= 17 && h < 21) return 'Good evening, ' + userName;
  return 'Still up, ' + userName + '?';
}

function setGreeting() {
  var el = document.getElementById('greetingText');
  if (el) el.textContent = getGreeting();
}

function setHeaderDate() {
  var str = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  var h = document.getElementById('headerDate');
  var h2 = document.getElementById('dashDate');
  if (h)  h.textContent  = str;
  if (h2) h2.textContent = str;
}

/* ── THEME ── */
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  document.getElementById('themeBtn').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('sc_dark', isDark);
}

/* ── NAV ── */
function showSection(name) {
  document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('active'); });
  document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.remove('active'); });
  document.getElementById(name).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(function (b) {
    if (b.getAttribute('onclick') && b.getAttribute('onclick').includes("'" + name + "'")) {
      b.classList.add('active');
    }
  });
  closeMobileNav();
  updateDashboard();
}

function toggleMobileNav() {
  var el = document.getElementById('mobileNav');
  if (el) el.classList.toggle('open');
}
function closeMobileNav() {
  var el = document.getElementById('mobileNav');
  if (el) el.classList.remove('open');
}

/* ── STORAGE ── */
function saveToStorage() {
  localStorage.setItem('sc_tasks',   JSON.stringify(tasks));
  localStorage.setItem('sc_classes', JSON.stringify(classes));
  localStorage.setItem('sc_grades',  JSON.stringify(grades));
  localStorage.setItem('sc_notes',   JSON.stringify(notes));
}

function loadFromStorage() {
  tasks   = JSON.parse(localStorage.getItem('sc_tasks')   || '[]');
  classes = JSON.parse(localStorage.getItem('sc_classes') || '[]');
  grades  = JSON.parse(localStorage.getItem('sc_grades')  || '[]');
  notes   = JSON.parse(localStorage.getItem('sc_notes')   || '[]');
  slides  = JSON.parse(localStorage.getItem('sc_slides')  || '[]');
}

/* ── DASHBOARD ── */
function updateDashboard() {
  var pending = tasks.filter(function (t) { return !t.done; }).length;
  document.getElementById('taskCount').textContent   = pending;
  document.getElementById('courseCount').textContent = grades.length;
  var gpa = calcGPA();
  var avgEl = document.getElementById('avgGrade');
  avgEl.textContent = gpa > 0 ? gpa.toFixed(2) : '-';
  avgEl.className = gpa > 0 ? gpaToClass(gpa) : '';
  var rem = document.getElementById('quickReminder');
  if (pending === 0)      rem.textContent = 'No pending tasks. Keep it up.';
  else if (pending === 1) rem.textContent = 'You have 1 pending task. Stay on top of it.';
  else                    rem.textContent = 'You have ' + pending + ' pending tasks. Stay focused.';
  setGreeting();
}

/* ── TASKS ── */
function addTask() {
  var name = document.getElementById('taskInput').value.trim();
  if (!name) { alert('Please enter a task name.'); return; }
  tasks.push({
    id: Date.now(),
    name: name,
    date: document.getElementById('taskDate').value,
    priority: document.getElementById('taskPriority').value,
    done: false
  });
  saveToStorage(); renderTasks(); updateDashboard();
  document.getElementById('taskInput').value = '';
  document.getElementById('taskDate').value  = '';
  document.getElementById('taskPriority').value = 'low';
}

function renderTasks() {
  var list = document.getElementById('taskList');
  list.innerHTML = '';
  if (!tasks.length) {
    list.innerHTML = '<li style="color:var(--text-sub);font-size:13px;background:transparent;box-shadow:none;">No tasks added yet.</li>';
    return;
  }
  tasks.forEach(function (task) {
    var li = el('li');
    var info = el('div', 'item-info');
    var t = el('span', 'item-title' + (task.done ? ' done-text' : ''));
    t.textContent = task.name;
    var s = el('span', 'item-sub');
    s.textContent = task.date ? 'Due: ' + task.date : 'No due date';
    info.append(t, s);
    var acts = el('div', 'item-actions');
    var badge = el('span', 'badge ' + task.priority);
    badge.textContent = task.priority;
    var doneBtn = el('button', 'done-btn');
    doneBtn.textContent = task.done ? 'Undo' : 'Done';
    doneBtn.onclick = bind(toggleTask, task.id);
    var delBtn = el('button', 'delete-btn');
    delBtn.textContent = '×';
    delBtn.onclick = bind(deleteTask, task.id);
    acts.append(badge, doneBtn, delBtn);
    li.append(info, acts);
    list.appendChild(li);
  });
}

function toggleTask(id) {
  tasks.forEach(function (t) { if (t.id === id) t.done = !t.done; });
  saveToStorage(); renderTasks(); updateDashboard();
}
function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveToStorage(); renderTasks(); updateDashboard();
}

/* ── TIMETABLE ── */
var ALL_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function getActiveDays() {
  var days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  if (showSat) days.push('Saturday');
  if (showSun) days.push('Sunday');
  return days;
}

function updateDayColumns() {
  showSat = document.getElementById('showSat').checked;
  showSun = document.getElementById('showSun').checked;
  localStorage.setItem('sc_showSat', showSat);
  localStorage.setItem('sc_showSun', showSun);

  // Update day dropdown options
  var sel = document.getElementById('classDay');
  var current = sel.value;
  sel.innerHTML = '';
  getActiveDays().forEach(function (d) {
    var opt = document.createElement('option');
    opt.value = d; opt.textContent = d;
    sel.appendChild(opt);
  });
  if (getActiveDays().includes(current)) sel.value = current;

  renderTimetable();
}

function addClass() {
  var name = document.getElementById('className').value.trim();
  if (!name) { alert('Please enter a course name.'); return; }
  var startTime = document.getElementById('classTime').value;
  var duration  = parseFloat(document.getElementById('classDuration').value);
  classes.push({
    id: Date.now(),
    day:      document.getElementById('classDay').value,
    name:     name,
    time:     startTime,
    duration: duration,
    room:     document.getElementById('classRoom').value.trim()
  });
  saveToStorage(); renderTimetable();
  document.getElementById('className').value = '';
  document.getElementById('classTime').value = '';
  document.getElementById('classRoom').value = '';
  document.getElementById('classDuration').value = '1';
}

function deleteClass(id) {
  classes = classes.filter(function (c) { return c.id !== id; });
  saveToStorage(); renderTimetable();
}

function renderTimetable() {
  var activeDays = getActiveDays();

  // Rebuild header row
  var headerRow = document.getElementById('ttHeaderRow');
  headerRow.innerHTML = '<th>Time</th>';
  activeDays.forEach(function (d) {
    var th = document.createElement('th');
    th.textContent = d;
    headerRow.appendChild(th);
  });

  var tbody = document.getElementById('ttBody');
  tbody.innerHTML = '';

  // Gather and sort unique start times
  var times = [];
  classes.forEach(function (c) {
    if (c.time && !times.includes(c.time)) times.push(c.time);
  });
  var hasNoTime = classes.some(function (c) { return !c.time; });
  times.sort();
  if (hasNoTime) times.push('');

  if (!classes.length) {
    var row = el('tr');
    var td = el('td', 'tt-empty');
    td.colSpan = activeDays.length + 1;
    td.textContent = 'No classes added yet. Use the form above to get started.';
    row.appendChild(td); tbody.appendChild(row);
    return;
  }

  times.forEach(function (time) {
    var row = el('tr');
    var timeCell = el('td', 'time-cell');
    timeCell.textContent = time ? formatTime(time) : '—';
    row.appendChild(timeCell);

    activeDays.forEach(function (day) {
      var td = el('td');
      var dayClasses = classes.filter(function (c) { return c.day === day && c.time === time; });
      dayClasses.forEach(function (cls) {
        var entry = el('div', 'tt-cell-entry');
        var text  = el('div', 'entry-text');
        var nameDiv = el('div', 'entry-name'); nameDiv.textContent = cls.name;
        var meta = [];
        if (cls.room) meta.push(cls.room);
        if (cls.duration && cls.duration !== 1) meta.push(cls.duration + 'hr' + (cls.duration !== 1 ? 's' : ''));
        var venueDiv = el('div', 'entry-venue');
        venueDiv.textContent = meta.join(' · ');
        if (cls.duration > 1) {
          var durSpan = el('div', 'entry-duration');
          durSpan.textContent = cls.duration + ' hr' + (cls.duration !== 1 ? 's' : '');
          text.append(nameDiv, venueDiv, durSpan);
        } else {
          text.append(nameDiv, venueDiv);
        }
        var del = el('button', 'delete-btn');
        del.textContent = '×'; del.style.fontSize = '13px';
        del.onclick = bind(deleteClass, cls.id);
        entry.append(text, del);
        td.appendChild(entry);
      });
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
}

function formatTime(t) {
  if (!t) return '';
  var parts = t.split(':');
  var h = parseInt(parts[0]), m = parts[1];
  var ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return h + ':' + m + ' ' + ampm;
}

function addMinutes(timeStr, mins) {
  var parts = timeStr.split(':');
  var total = parseInt(parts[0]) * 60 + parseInt(parts[1]) + mins;
  var h = Math.floor(total / 60) % 24;
  var m = total % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

/* ── TIMETABLE PDF ── */
function exportTimetablePDF() {
  if (typeof window.jspdf === 'undefined') {
    alert('PDF library is loading, please try again in a moment.'); return;
  }
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  var activeDays = getActiveDays();
  var ttName = document.getElementById('ttName').value || 'Weekly Timetable';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text(ttName, 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }), 14, 22);

  var times = [];
  classes.forEach(function (c) { if (c.time && !times.includes(c.time)) times.push(c.time); });
  if (classes.some(function (c) { return !c.time; })) times.push('');
  times.sort();

  var head = [['Time'].concat(activeDays)];
  var body = times.map(function (time) {
    var row = [time ? formatTime(time) : '—'];
    activeDays.forEach(function (day) {
      var cells = classes.filter(function (c) { return c.day === day && c.time === time; });
      row.push(cells.map(function (c) {
        var line = c.name;
        if (c.room) line += '\n' + c.room;
        if (c.duration && c.duration !== 1) line += '\n' + c.duration + ' hrs';
        return line;
      }).join('\n\n'));
    });
    return row;
  });

  if (!body.length) {
    doc.setFontSize(11); doc.setTextColor(150, 150, 150);
    doc.text('No classes have been added to this timetable.', 14, 34);
  } else {
    doc.autoTable({
      head: head, body: body, startY: 28,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [26, 26, 26], textColor: [201, 168, 76], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 247, 245] },
      columnStyles: { 0: { cellWidth: 22, fontStyle: 'bold', textColor: [100, 100, 100] } }
    });
  }
  doc.save(ttName.replace(/\s+/g, '_') + '.pdf');
}

/* ── GRADES ── */
function scoreToGrade(s) {
  if (s >= 80) return 'A';
  if (s >= 75) return 'B+';
  if (s >= 70) return 'B';
  if (s >= 65) return 'C+';
  if (s >= 60) return 'C';
  if (s >= 55) return 'D+';
  if (s >= 50) return 'D';
  return 'F';
}
function scoreToPoints(s) {
  if (s >= 80) return 4.0;
  if (s >= 75) return 3.5;
  if (s >= 70) return 3.0;
  if (s >= 65) return 2.5;
  if (s >= 60) return 2.0;
  if (s >= 55) return 1.5;
  if (s >= 50) return 1.0;
  return 0.0;
}
function calcGPA() {
  if (!grades.length) return 0;
  var tp = 0, tc = 0;
  grades.forEach(function (g) { tp += scoreToPoints(g.score) * g.credits; tc += g.credits; });
  return tc ? tp / tc : 0;
}

function addGrade() {
  var name    = document.getElementById('courseName').value.trim();
  var score   = parseFloat(document.getElementById('courseScore').value);
  var credits = parseInt(document.getElementById('courseCredits').value);
  if (!name || isNaN(score) || isNaN(credits)) { alert('Please fill in all grade fields.'); return; }
  if (score < 0 || score > 100) { alert('Score must be between 0 and 100.'); return; }
  grades.push({ id: Date.now(), name: name, score: score, credits: credits });
  saveToStorage(); renderGrades(); updateDashboard();
  document.getElementById('courseName').value  = '';
  document.getElementById('courseScore').value = '';
  document.getElementById('courseCredits').value = '';
}

function scoreToGradeClass(s) {
  if (s >= 80) return 'grade-good';
  if (s >= 50) return 'grade-okay';
  return 'grade-bad';
}

function gpaToClass(g) {
  if (g >= 3.0) return 'gpa-good';
  if (g >= 1.5) return 'gpa-okay';
  return 'gpa-bad';
}

function renderGrades() {
  var list = document.getElementById('gradeList');
  list.innerHTML = '';
  var gpa = calcGPA();
  var gpaEl = document.getElementById('gpaValue');
  gpaEl.textContent = gpa.toFixed(2);
  gpaEl.className = gpa > 0 ? gpaToClass(gpa) : '';
  if (!grades.length) {
    list.innerHTML = '<li style="color:var(--text-sub);font-size:13px;background:transparent;box-shadow:none;">No courses added yet.</li>';
    return;
  }
  grades.forEach(function (g) {
    var li = el('li');
    var info = el('div', 'item-info');
    var t = el('span', 'item-title'); t.textContent = g.name;
    var s = el('span', 'item-sub');  s.textContent = g.credits + ' credit hours';
    info.append(t, s);
    var acts = el('div', 'item-actions');
    var badge = el('span', 'badge ' + scoreToGradeClass(g.score));
    badge.textContent = g.score + '% · ' + scoreToGrade(g.score);
    var del = el('button', 'delete-btn'); del.textContent = '×';
    del.onclick = bind(deleteGrade, g.id);
    acts.append(badge, del);
    li.append(info, acts);
    list.appendChild(li);
  });
}

function deleteGrade(id) {
  grades = grades.filter(function (g) { return g.id !== id; });
  saveToStorage(); renderGrades(); updateDashboard();
}

/* ── NOTES ── */
function addNote() {
  var title = document.getElementById('noteTitle').value.trim();
  var body  = document.getElementById('noteBody').value.trim();
  if (!title || !body) { alert('Please enter a title and note content.'); return; }
  notes.push({ id: Date.now(), title: title, body: body });
  saveToStorage(); renderNotes();
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteBody').value  = '';
}

function renderNotes() {
  var container = document.getElementById('notesList');
  container.innerHTML = '';
  if (!notes.length) {
    container.innerHTML = '<p style="color:var(--text-sub);font-size:13px;">No notes yet.</p>';
    return;
  }
  notes.forEach(function (note) {
    var card = el('div', 'note-card');
    var h4 = el('h4'); h4.textContent = note.title;
    var p  = el('p');  p.textContent  = note.body;
    var del = el('button', 'delete-btn'); del.textContent = '×';
    del.onclick = bind(deleteNote, note.id);
    card.append(h4, p, del);
    container.appendChild(card);
  });
}

function deleteNote(id) {
  notes = notes.filter(function (n) { return n.id !== id; });
  saveToStorage(); renderNotes();
}

/* ── SLIDES ── */
function handleDragOver(e)  { e.preventDefault(); document.getElementById('uploadArea').classList.add('dragover'); }
function handleDragLeave()  { document.getElementById('uploadArea').classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('dragover');
  processFiles(e.dataTransfer.files);
}
function handleFileSelect(e) { processFiles(e.target.files); e.target.value = ''; }

function processFiles(fileList) {
  if (!fileList.length) return;
  Array.from(fileList).forEach(function (file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var course = prompt('Tag "' + file.name + '" with a course name (optional):', '') || '';
      slides.push({
        id:     Date.now() + Math.random(),
        name:   file.name,
        type:   file.type,
        size:   file.size,
        course: course.trim(),
        data:   e.target.result
      });
      localStorage.setItem('sc_slides', JSON.stringify(slides));
      renderSlides();
    };
    reader.readAsDataURL(file);
  });
}

function renderSlides() {
  var container = document.getElementById('slidesList');
  var tagArea   = document.getElementById('slidesTagFilter');
  container.innerHTML = '';
  tagArea.innerHTML   = '';

  if (!slides.length) {
    container.innerHTML = '<p style="color:var(--text-sub);font-size:13px;">No slides uploaded yet.</p>';
    return;
  }

  var courses = slides.map(function (s) { return s.course; }).filter(Boolean)
    .filter(function (v, i, a) { return a.indexOf(v) === i; });

  if (courses.length) {
    makeTagBtn(tagArea, 'All', true, function () { renderSlidesGrid(slides); });
    courses.forEach(function (c) {
      makeTagBtn(tagArea, c, false, function () {
        renderSlidesGrid(slides.filter(function (s) { return s.course === c; }));
      });
    });
  }

  renderSlidesGrid(slides);
}

function makeTagBtn(parent, label, active, onClick) {
  var btn = document.createElement('button');
  btn.textContent = label;
  btn.style.cssText = 'padding:4px 12px;border-radius:20px;border:1.5px solid var(--border);' +
    'background:' + (active ? 'var(--gold)' : 'var(--surface)') + ';' +
    'color:' + (active ? '#111' : 'var(--text)') + ';' +
    'font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:4px;';
  btn.onclick = onClick;
  parent.appendChild(btn);
}

function renderSlidesGrid(list) {
  var container = document.getElementById('slidesList');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p style="color:var(--text-sub);font-size:13px;">No slides for this filter.</p>';
    return;
  }
  list.forEach(function (slide) {
    var card = el('div', 'slide-card');
    var icon = el('div', 'slide-icon'); icon.textContent = getFileIcon(slide.type, slide.name);
    var name = el('div', 'slide-name'); name.textContent = slide.name;
    var course = el('div', 'slide-course'); course.textContent = slide.course || 'Untagged';
    var size = el('div', 'slide-size'); size.textContent = formatFileSize(slide.size);
    var acts = el('div', 'slide-actions');
    var openBtn = document.createElement('a');
    openBtn.className = 'slide-open-btn';
    openBtn.textContent = 'Open / Download';
    openBtn.href = slide.data; openBtn.target = '_blank'; openBtn.download = slide.name;
    acts.appendChild(openBtn);
    var del = el('button', 'delete-btn'); del.textContent = '×';
    del.onclick = bind(deleteSlide, slide.id);
    card.append(icon, name, course, size, acts, del);
    container.appendChild(card);
  });
}

function deleteSlide(id) {
  slides = slides.filter(function (s) { return s.id !== id; });
  localStorage.setItem('sc_slides', JSON.stringify(slides));
  renderSlides();
}

function getFileIcon(type, name) {
  var ext = name.split('.').pop().toLowerCase();
  if (type.includes('pdf')  || ext === 'pdf')  return '📄';
  if (type.includes('presentation') || ext === 'pptx' || ext === 'ppt') return '📊';
  if (type.includes('word') || ext === 'docx' || ext === 'doc') return '📝';
  if (type.includes('image')) return '🖼️';
  if (type.includes('video')) return '🎥';
  if (ext === 'zip' || ext === 'rar') return '🗜️';
  return '📁';
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/* ── HELPERS ── */
function el(tag, cls) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function bind(fn, id) {
  return function () { fn(id); };
}