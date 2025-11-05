function validateTimeFormat(t) {
  return /^\d{2}:\d{2}$/.test(t);
}

function validateRecord({ employeeId, date, checkin, checkout }) {
  if (!employeeId || !date) throw new Error('employeeId y date son requeridos');
  if (checkin && !validateTimeFormat(checkin)) throw new Error('Formato de hora inválido');
  if (checkout && !validateTimeFormat(checkout)) throw new Error('Formato de hora inválido');
}

module.exports = { validateRecord };
