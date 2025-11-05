const db = require('../db/sqlite');

// Insertar nuevo registro
function insertAttendance({ employeeId, name, date, checkin, status }) {
  const stmt = db.prepare(`
    INSERT INTO attendance (employeeId, name, date, checkin, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(employeeId, name, date, checkin, status);
  return info.lastInsertRowid;
}

const findByEmployeeAndDate = (employeeId, date) => {
  const stmt = db.prepare(`SELECT * FROM attendance WHERE employeeId=? AND date=?`);
  return stmt.get(employeeId, date);
};

// Actualizar salida
function updateAttendance({ id, checkin, checkout, status }) {
  const stmt = db.prepare(`
    UPDATE attendance
    SET checkin = ?, checkout = ?, status = ?
    WHERE id = ?
  `);
  stmt.run(checkin, checkout, status, id);
}

module.exports = { insertAttendance, findByEmployeeAndDate, updateAttendance };
