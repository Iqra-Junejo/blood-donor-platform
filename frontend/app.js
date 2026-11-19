const API = '/api';
const GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

let allDonors = [];
let activeGroup = 'All';

const $ = (id) => document.getElementById(id);

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg, type) {
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show ' + (type || '');
  setTimeout(() => (t.className = 'toast'), 3200);
}

function renderChips() {
  $('chips').innerHTML = GROUPS.map(
    (g) => `<button class="chip ${g === activeGroup ? 'active' : ''}" data-g="${g}">${g}</button>`
  ).join('');
}

function render() {
  const city = $('fCity').value.trim().toLowerCase();
  const list = allDonors.filter(
    (d) =>
      (activeGroup === 'All' || d.bloodGroup === activeGroup) &&
      (!city || d.city.toLowerCase().includes(city))
  );

  $('resultCount').textContent = list.length
    ? `${list.length} donor${list.length > 1 ? 's' : ''} found`
    : '';

  $('list').innerHTML = list.length
    ? list
        .map(
          (d) => `
      <div class="donor">
        <div class="avatar">${esc(d.bloodGroup)}</div>
        <div>
          <h4>${esc(d.name)}</h4>
          <p>${esc(d.city)}</p>
          <a href="tel:${esc(d.phone)}">${esc(d.phone)}</a>
        </div>
      </div>`
        )
        .join('')
    : '<div class="empty">No donors found for this search. Try another blood group or city.</div>';
}

async function loadDonors() {
  try {
    const res = await fetch(`${API}/donors`);
    allDonors = await res.json();
  } catch (e) {
    allDonors = [];
    toast('Could not reach the server', 'err');
  }
  $('statDonors').textContent = allDonors.length;
  render();
}

// events
$('chips').addEventListener('click', (e) => {
  const g = e.target.dataset.g;
  if (!g) return;
  activeGroup = g;
  renderChips();
  render();
});

$('fCity').addEventListener('input', render);

$('quickBtn').addEventListener('click', () => {
  const g = $('quickGroup').value;
  activeGroup = g || 'All';
  renderChips();
  render();
  document.getElementById('find').scrollIntoView();
});

$('donorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch(`${API}/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    e.target.reset();
    toast('Thank you! You are now registered as a donor.', 'ok');
    loadDonors();
  } catch (err) {
    toast('Registration failed. Please try again.', 'err');
  }
});

$('menuBtn').addEventListener('click', () => $('navLinks').classList.toggle('open'));
$('navLinks').addEventListener('click', () => $('navLinks').classList.remove('open'));

renderChips();
loadDonors();
