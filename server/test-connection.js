// server/test-connection.js
import pkg from 'pg';
const { Pool } = pkg;

// HARDCODE credentials for testing
const pool = new Pool({
  user: 'flore',
  password: 'camacho1212junior',
  host: 'localhost',
  port: 5432,
  database: 'local_event_hub',
});

async function test() {
  try {
    console.log('Testing connection with hardcoded credentials...');
    const result = await pool.query('SELECT NOW() as time, current_user, current_database()');
    console.log('✅ SUCCESS!');
    console.log('   Time:', result.rows[0].time);
    console.log('   User:', result.rows[0].current_user);
    console.log('   Database:', result.rows[0].current_database);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    process.exit(1);
  }
}

test();