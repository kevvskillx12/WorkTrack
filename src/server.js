const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketio = require('socket.io');
const attendanceController = require('./controllers/attendanceController');
const bus = require('./events/eventBus');
const db = require('./db/sqlite');

// Inicializar servicios que escuchan el bus
require('./services/notificationService');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

// ✅ Ruta raíz
//app.get('/', (req, res) => {
  //res.send('✅ Bienvenido a WorkTrack API — Servidor activo y conectado a la base de datos');
//});

app.get('/attendances', (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM attendance';
    let params = [];

    if (startDate && endDate) {
      query += ' WHERE date BETWEEN ? AND ?';
      params = [startDate, endDate];
    }

    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Rutas API
app.post('/checkin', attendanceController.checkin);
app.post('/checkout', attendanceController.checkout);

// 🧠 Crear servidor HTTP y configurar Socket.IO
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

// 📡 Conexión de clientes (Patrón Observer)
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.emit('connection', { message: 'Conectado a WorkTrack en tiempo real ✅' });
});

// 🔔 Relé de eventos del bus hacia los clientes conectados (Observer)
bus.on('attendance:created', (payload) => {
  console.log('📥 Evento emitido: asistencia creada');
  io.emit('attendance:created', payload);
});

bus.on('attendance:updated', (payload) => {
  console.log('📤 Evento emitido: asistencia actualizada');
  io.emit('attendance:updated', payload);
});

bus.on('attendance:late', (payload) => {
  console.log('⏰ Evento emitido: asistencia con retraso');
  io.emit('attendance:late', payload);
});

// 🚀 Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
