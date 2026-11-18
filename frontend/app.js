const API = '/api';

async function loadDonors() {
  const g = document.getElementById('fGroup').value;
  const c = document.getElementById('fCity').value;
  const params = new URLSearchParams();
  if (g) params.append('bloodGroup', g);
  if (c) params.append('city', c);
  const res = await fetch(`${API}/donors?${params}`);
  const donors = await res.json();
  const tbody = document.getElementById('list');
  tbody.innerHTML = donors.length
    ? donors.map(d => `<tr><td>${d.name}</td><td>${d.bloodGroup}</td><td>${d.city}</td><td>${d.phone}</td></tr>`).join('')
    : '<tr><td colspan="4">No donors found</td></tr>';
}

document.getElementById('donorForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const res = await fetch(`${API}/donors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  document.getElementById('msg').textContent = res.ok ? 'Registered successfully!' : 'Error registering.';
  if (res.ok) { e.target.reset(); loadDonors(); }
});

document.getElementById('searchBtn').addEventListener('click', loadDonors);
loadDonors();
