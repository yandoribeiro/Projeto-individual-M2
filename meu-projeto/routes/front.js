const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const methodOverride = require('method-override');

// Middleware para suportar PUT e DELETE via forms (query string ?_method=PUT/DELETE)
router.use(methodOverride('_method'));

// Página inicial (home)
router.get('/', (req, res) => {
  res.render('pages/home');  // renderiza views/pages/home.ejs
});

//////////////////////////
// ROTAS DE CATEGORIAS //
//////////////////////////

// Listar todas as categorias com suas tarefas
router.get('/categories', async (req, res) => {
  try {
    // Buscar categorias
    const { rows: categories } = await pool.query('SELECT * FROM categories ORDER BY id');

    // Buscar tarefas associadas às categorias
    const { rows: tasks } = await pool.query(`
      SELECT c.id AS category_id, c.name AS category_name, t.id AS task_id, t.title
      FROM categories c
      LEFT JOIN task_categories tc ON c.id = tc.category_id
      LEFT JOIN tasks t ON t.id = tc.task_id
      ORDER BY c.id, t.id
    `);

    // Vincular tarefas às suas categorias
    const categoriesWithTasks = categories.map(category => {
      return {
        ...category,
        tasks: tasks
          .filter(task => task.category_id === category.id)
          .map(task => ({ id: task.task_id, title: task.title }))
      };
    });

    res.render('pages/categories', { categories: categoriesWithTasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar categorias com tarefas');
  }
});

// Formulário nova categoria
router.get('/categories/new', (req, res) => {
  res.render('pages/new-category');
});

// Criar nova categoria
router.post('/categories', async (req, res) => {
  try {
    const { name, user_id } = req.body;
    if (!name || !user_id) {
      return res.status(400).send('name e user_id são obrigatórios');
    }
    await pool.query('INSERT INTO categories (name, user_id) VALUES ($1, $2)', [name, user_id]);
    res.redirect('/categories');
  } catch (err) {
    res.status(500).send('Erro ao criar categoria');
  }
});

// Formulário editar categoria
router.get('/categories/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).send('Categoria não encontrada');
    res.render('pages/edit-category', { category: rows[0] });
  } catch (err) {
    res.status(500).send('Erro ao carregar categoria');
  }
});

// Atualizar categoria
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).send('name é obrigatório');
    }
    const result = await pool.query('UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }
    res.redirect('/categories');
  } catch (err) {
    res.status(500).send('Erro ao atualizar categoria');
  }
});

// Deletar categoria
router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }
    res.redirect('/categories');
  } catch (err) {
    res.status(500).send('Erro ao excluir categoria');
  }
});

///////////////////////
// ROTAS DE TAREFAS //
///////////////////////

// Listar todas as tarefas
router.get('/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.render('pages/tasks', { tasks: rows });
  } catch (err) {
    res.status(500).send('Erro ao carregar tarefas');
  }
});

// Formulário nova tarefa
router.get('/tasks/new', (req, res) => {
  res.render('pages/new-task');
});

// Criar nova tarefa
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, user_id, due_date, priority, status } = req.body;
    if (!title || !user_id) {
      return res.status(400).send('title e user_id são obrigatórios');
    }
    await pool.query(
      'INSERT INTO tasks (title, description, user_id, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [title, description || '', user_id, due_date || null, priority || 'medium', status || 'pending']
    );
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Erro ao criar tarefa');
  }
});

// Formulário editar tarefa
router.get('/tasks/edit/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) return res.status(404).send('Tarefa não encontrada');
    res.render('pages/edit-task', { task: rows[0] });
  } catch (err) {
    res.status(500).send('Erro ao carregar tarefa');
  }
});

// Atualizar tarefa
router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority, status } = req.body;
    if (!title) {
      return res.status(400).send('title é obrigatório');
    }
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5 WHERE id = $6 RETURNING *',
      [title, description || '', due_date || null, priority || 'medium', status || 'pending', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Erro ao atualizar tarefa');
  }
});

// Deletar tarefa
router.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    res.redirect('/tasks');
  } catch (err) {
    res.status(500).send('Erro ao excluir tarefa');
  }
});

module.exports = router;
