// controllers/UserController.js
const pool = require('../config/database');

// Criar novo usuário
exports.criarUsuario = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'O campo username é obrigatório.' });
  }

  const query = 'INSERT INTO users (username) VALUES ($1) RETURNING *';
  
  try {
    const result = await pool.query(query, [username]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  const query = 'SELECT * FROM users ORDER BY id';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar usuário
exports.atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'O campo username é obrigatório.' });
  }

  const query = 'UPDATE users SET username = $1 WHERE id = $2 RETURNING *';

  try {
    const result = await pool.query(query, [username, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar um usuário por ID
exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = $1 RETURNING *';

  try {
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
