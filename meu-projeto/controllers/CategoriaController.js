const pool = require('../config/database');

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
  const { name, user_id } = req.body;
  if (!name || !user_id) {
    return res.status(400).json({ error: 'name e user_id são obrigatórios.' });
  }

  const query = 'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *';
  try {
    const result = await pool.query(query, [name, user_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar categorias do usuário
exports.listarCategorias = async (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM categories WHERE user_id = $1 ORDER BY name';
  try {
    const result = await pool.query(query, [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar categoria
exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name é obrigatório.' });
  }

  const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
  try {
    const result = await pool.query(query, [name, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar categoria
exports.excluirCategoria = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  try {
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }
    res.status(200).json({ message: 'Categoria excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
