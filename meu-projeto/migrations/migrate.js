require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const sql = fs.readFileSync(__dirname + '/../scripts/init.sql').toString();


(async () => {
  try {
    await pool.query(sql);
    console.log('Migração executada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar migração:', error);
    process.exit(1);
  }
})();
