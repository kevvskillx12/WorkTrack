const tableBody = document.getElementById('attendanceTable');
const msgDiv = document.getElementById('msg');

const socket = io();

// Función para renderizar registros
function renderTable(records) {
  tableBody.innerHTML = '';
  records.forEach(r => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${r.id}</td>
      <td>${r.employeeId}</td>
      <td>${r.name || '--'}</td>
      <td>${r.date}</td>
      <td>${r.checkin || '--:--'}</td>
      <td>${r.checkout || '--:--'}</td>
      <td>${r.status || 'unknown'}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Cargar registros al iniciar
async function loadAll() {
  try {
    const res = await fetch('/attendances');
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error(err);
  }
}

// Registrar Check-in
document.getElementById('checkinBtn').addEventListener('click', async () => {
  const employeeId = document.getElementById('employeeId').value;
  const name = document.getElementById('name').value;
  const time = document.getElementById('time').value;
  const date = new Date().toISOString().slice(0,10);

  if (!employeeId || !name || !time) return alert('Completa todos los campos');

  try {
    const res = await fetch('/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, name, date, time })
    });
    const data = await res.json();
    msgDiv.innerText = data.message || JSON.stringify(data);
  } catch (err) {
    console.error(err);
  }
});

// Registrar Check-out
document.getElementById('checkoutBtn').addEventListener('click', async () => {
  const employeeId = document.getElementById('employeeId').value;
  const time = document.getElementById('time').value;
  const date = new Date().toISOString().slice(0,10);

  if (!employeeId || !time) return alert('Completa ID y hora');

  try {
    const res = await fetch('/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, date, time })
    });
    const data = await res.json();
    msgDiv.innerText = data.message || JSON.stringify(data);
  } catch (err) {
    console.error(err);
  }
});

// Consultar por fechas
document.getElementById('loadBtn').addEventListener('click', async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if (!startDate || !endDate) return alert('Selecciona ambas fechas');
  
  try {
    const res = await fetch(`/attendances?startDate=${startDate}&endDate=${endDate}`);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error(err);
  }
});

// Escuchar eventos de Socket.IO (Observer)
socket.on('attendance:created', (payload) => {
  msgDiv.innerText = `Nuevo check-in de ${payload.name || payload.employeeId}`;
  loadAll();
});

socket.on('attendance:updated', (payload) => {
  msgDiv.innerText = `Check-out registrado de ${payload.employeeId}`;
  loadAll();
});

socket.on('attendance:late', (payload) => {
  alert(`⚠️ Empleado ${payload.employeeId} llegó tarde ${payload.minutesLate} minutos`);
});

// Cargar registros iniciales
loadAll();
