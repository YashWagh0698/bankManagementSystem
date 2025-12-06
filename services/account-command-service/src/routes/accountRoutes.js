const express = require('express');
const router = express.Router();
const { getPool } = require('../db');

router.get('/health', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT 1 AS ok;');
    res.json({ db: 'connected', result: result.recordset });
  } catch (err) {
    console.error('DB health check failed:', err);
    res.status(500).json({
      error: 'DB connection failed',
      message: err.message   // 👈 ADD THIS
    });
  }
});

module.exports = router;
