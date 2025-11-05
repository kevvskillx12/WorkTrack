const axios = require('axios');

async function simulate() {
  const base = 'http://localhost:3000';

  await axios.post(base + '/checkin', { employeeId: 'E001', name: 'Juan', date: '2025-11-05', time: '09:20' });
  await axios.post(base + '/checkin', { employeeId: 'E002', name: 'María', date: '2025-11-05', time: '08:55' });
  await axios.post(base + '/checkout', { employeeId: 'E001', date: '2025-11-05', time: '17:10' });
}

simulate().catch(console.error);
