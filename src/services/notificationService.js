const bus = require('../events/eventBus');

// 🕘 Hora de inicio programada (ajústala si quieres otro horario)
const scheduledStart = '09:00';

// Función auxiliar: calcula minutos entre dos horas (HH:MM)
function minutesBetween(t1, t2) {
  const [h1, m1] = t1.split(':').map(Number);
  const [h2, m2] = t2.split(':').map(Number);
  return (h2 * 60 + m2) - (h1 * 60 + m1);
}

// 🎯 Escucha eventos de asistencia creada o actualizada
bus.on('attendance:created', ({ type, employeeId, date, time, id }) => {
  if (type === 'checkin') {
    const minsLate = minutesBetween(scheduledStart, time);
    if (minsLate > 5) {
      console.log(`⚠️ Empleado ${employeeId} llegó tarde (${minsLate} min después)`);
      bus.emit('attendance:late', {
        employeeId,
        date,
        scheduledStart,
        actualStart: time,
        minutesLate: minsLate,
        id
      });
    }
  }
});

bus.on('attendance:updated', ({ type, employeeId, date, time, id }) => {
  if (type === 'checkin') {
    const minsLate = minutesBetween(scheduledStart, time);
    if (minsLate > 5) {
      console.log(`⚠️ Empleado ${employeeId} llegó tarde (${minsLate} min después)`);
      bus.emit('attendance:late', {
        employeeId,
        date,
        scheduledStart,
        actualStart: time,
        minutesLate: minsLate,
        id
      });
    }
  }
});

console.log('✅ Servicio de notificaciones cargado (detector de retardos activo)');
