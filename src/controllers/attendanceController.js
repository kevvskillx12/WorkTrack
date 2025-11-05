const model = require('../models/attendanceModel');
const bus = require('../events/eventBus');
const { validateRecord } = require('../validators/attendanceValidator');

// Registrar entrada
function checkin(req, res) {
  try {
    const { employeeId, name, date, time } = req.body;
    validateRecord({ employeeId, date, checkin: time });

    const existing = model.findByEmployeeAndDate(employeeId, date);
    if (existing) return res.status(409).json({ error: 'El empleado ya tiene registro hoy.' });

    const id = model.insertAttendance({ employeeId, name, date, checkin: time, status: 'present' });
    bus.emit('attendance:created', { type: 'checkin', employeeId, name, date, time, id });
    return res.json({
  status: "success",
  message: `Check-in registrado para ${name} (${employeeId}) a las ${time}`,
  data: {
    id,
    employeeId,
    name,
    date,
    checkin: time
  }
});

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

// Registrar salida
function checkout(req, res) {
  try {
    const { employeeId, date, time } = req.body;
    validateRecord({ employeeId, date, checkout: time });
    const existing = model.findByEmployeeAndDate(employeeId, date);
    if (!existing) return res.status(404).json({ error: 'Registro no encontrado' });

    if (!existing.checkin) return res.status(400).json({ error: 'No se puede registrar salida antes de entrada' });

    model.updateAttendance({ id: existing.id, checkin: existing.checkin, checkout: time, status: existing.status });
    bus.emit('attendance:updated', { type: 'checkout', employeeId, date, time, id: existing.id });
    return res.json({
      status: "success",
      message: `Checkout registrado para ${employeeId} a las ${time}`,
      data: {
        employeeId,
        date,
        checkout: time
      }
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { checkin, checkout };
