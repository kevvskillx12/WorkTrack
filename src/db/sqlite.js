const Database = require('better-sqlite3');
const db = new Database('./worktrack.db');

db.exec(`
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employeeId TEXT NOT NULL,
  name TEXT,
  date TEXT NOT NULL,
  checkin TEXT,
  checkout TEXT,
  status TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);
`);

module.exports = db;
