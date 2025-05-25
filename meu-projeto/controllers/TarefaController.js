// controllers/TarefaController.js
const pool = require('../config/database');

// Criar nova tarefa
exports.criarTarefa = async (req, res) => {
  const { user_id, title, description, due_date, priority, status } = req.body;
  const query = `
    INSERT INTO tasks (user_id, title, description, due_date, priority, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`;
  const values = [user_id, title, description, due_date, priority, status];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todas as tarefas
exports.listarTarefas = async (req, res) => {
  const query = 'SELECT * FROM tasks';

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar tarefa pelo id
exports.editarTarefa = async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority, status } = req.body;

  const query = `
    UPDATE tasks SET
      title = $1,
      description = $2,
      due_date = $3,
      priority = $4,
      status = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6 RETURNING *`;

  const values = [title, description, due_date, priority, status, id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir tarefa pelo id
exports.excluirTarefa = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
  const values = [id];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
