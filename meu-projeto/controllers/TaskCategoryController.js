const pool = require('../config/database');

// Adicionar uma associação entre uma tarefa e uma categoria
exports.adicionarCategoriaATarefa = async (req, res) => {
  const { task_id, category_id } = req.body;
  if (!task_id || !category_id) {
    return res.status(400).json({ error: 'task_id e category_id são obrigatórios.' });
  }

  try {
    const query = 'INSERT INTO task_categories (task_id, category_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [task_id, category_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remover uma associação entre uma tarefa e uma categoria
exports.removerCategoriaDaTarefa = async (req, res) => {
  const { task_id, category_id } = req.body;
  if (!task_id || !category_id) {
    return res.status(400).json({ error: 'task_id e category_id são obrigatórios.' });
  }

  try {
    const query = 'DELETE FROM task_categories WHERE task_id = $1 AND category_id = $2 RETURNING *';
    const result = await pool.query(query, [task_id, category_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Associação não encontrada' });
    }
    res.status(200).json({ message: 'Associação removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar categorias associadas a uma tarefa
exports.listarCategoriasDaTarefa = async (req, res) => {
  const { task_id } = req.params;
  try {
    const query = `
      SELECT c.*
      FROM categories c
      INNER JOIN task_categories tc ON tc.category_id = c.id
      WHERE tc.task_id = $1
    `;
    const result = await pool.query(query, [task_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
