const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const methodOverride = require('method-override');
const { isAuthenticated } = require('../middleware/auth');

// Middleware para suportar PUT e DELETE via forms
router.use(methodOverride('_method'));

// Middleware para verificar se o usuário tem acesso a uma tarefa específica
async function checkTaskOwnership(req, res, next) {
  try {
    const taskId = req.params.id;
    const userId = req.session.userId;
    
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );
    
    if (rows.length === 0) {
      return res.status(403).send('Acesso negado: esta tarefa não pertence ao usuário logado');
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao verificar propriedade da tarefa');
  }
}

// Middleware para verificar se o usuário tem acesso a uma categoria específica
async function checkCategoryOwnership(req, res, next) {
  try {
    const categoryId = req.params.id;
    const userId = req.session.userId;
    
    const { rows } = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [categoryId, userId]
    );
    
    if (rows.length === 0) {
      return res.status(403).send('Acesso negado: esta categoria não pertence ao usuário logado');
    }
    
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao verificar propriedade da categoria');
  }
}

// Página inicial (home) - protegida por autenticação
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Obter o ID do usuário da sessão
    const userId = req.session.userId;
    
    // Buscar apenas as tarefas do usuário logado
    const { rows: tasks } = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', 
      [userId]
    );
    
    // Buscar categorias do usuário logado
    const { rows: categories } = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    
    // Calcular estatísticas
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'pending').length;
    const totalCategories = categories.length;
    
    // Renderizar a página inicial com os dados filtrados
    res.render('pages/home', { 
      user: req.session.user,
      tasks: tasks,
      categories: categories,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        totalCategories
      },
      bodyClass: 'home-dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar página inicial');
  }
});

// Página de login
router.get('/login', (req, res) => {
  // Se já estiver logado, redireciona para a página inicial
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('pages/login');
});

// Processar login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Verificar se o usuário existe e a senha está correta
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2', 
      [username, password]
    );
    
    if (rows.length === 0) {
      return res.render('pages/login', { error: 'Usuário ou senha incorretos' });
    }
    
    const user = rows[0];
    
    console.log('Login bem-sucedido para usuário:', user.username, 'ID:', user.id); // Log para debug
    
    // Salvar informações do usuário na sessão
    req.session.userId = user.id;
    req.session.user = user;
    
    // Redirecionar para a página inicial após login bem-sucedido
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('pages/login', { error: 'Erro ao fazer login' });
  }
});

// Página de registro
router.get('/register', (req, res) => {
  // Se já estiver logado, redireciona para a página inicial
  if (req.session && req.session.userId) {
    return res.redirect('/');
  }
  res.render('pages/register');
});

// Processar registro
router.post('/register', async (req, res) => {
  try {
    const { username, password, confirm_password } = req.body;
    
    // Verificar se as senhas coincidem
    if (password !== confirm_password) {
      return res.render('pages/register', { error: 'As senhas não coincidem' });
    }
    
    // Verificar se o usuário já existe
    const checkUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (checkUser.rows.length > 0) {
      return res.render('pages/register', { error: 'Nome de usuário já existe' });
    }
    
    // Criar novo usuário com senha em texto simples
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', 
      [username, password]
    );
    const newUser = result.rows[0];
    
    // Fazer login automático após o registro
    req.session.userId = newUser.id;
    req.session.user = newUser;
    
    // Redirecionar para a página inicial após registro bem-sucedido
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('pages/register', { error: 'Erro ao registrar usuário' });
  }
});

// Rota de logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Listar todas as categorias com suas tarefas (apenas do usuário logado)
router.get('/categories', isAuthenticated, async (req, res) => {
  try {
    // Obter o ID do usuário da sessão
    const userId = req.session.userId;
    
    // Buscar categorias do usuário logado
    const { rows: categories } = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
    );

    // Para cada categoria, buscar suas tarefas
    const categoriesWithTasks = await Promise.all(categories.map(async (category) => {
      const { rows: tasks } = await pool.query(`
        SELECT t.id, t.title, t.status, t.priority
        FROM tasks t
        JOIN task_categories tc ON t.id = tc.task_id
        WHERE tc.category_id = $1
        ORDER BY 
          CASE 
            WHEN t.status = 'pending' THEN 1
            WHEN t.status = 'completed' THEN 2
            ELSE 3
          END,
          CASE
            WHEN t.priority = 'high' THEN 1
            WHEN t.priority = 'medium' THEN 2
            ELSE 3
          END,
          t.due_date NULLS LAST
      `, [category.id]);
      
      return {
        ...category,
        tasks
      };
    }));

    res.render('pages/categories', { categories: categoriesWithTasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar categorias com tarefas');
  }
});

// Formulário nova categoria
router.get('/categories/new', isAuthenticated, (req, res) => {
  res.render('pages/new-category');
});

// Criar nova categoria
router.post('/categories', isAuthenticated, async (req, res) => {
  try {
    const { name, color } = req.body;
    
    // Obter ID do usuário da sessão
    const user_id = req.session.userId;
    
    if (!name) {
      return res.status(400).send('Nome da categoria é obrigatório');
    }
    
    // Inserir a categoria com a cor (se fornecida)
    await pool.query(
      'INSERT INTO categories (name, user_id, color) VALUES ($1, $2, $3)', 
      [name, user_id, color || null]
    );
    
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar categoria');
  }
});

// Formulário editar categoria
router.get('/categories/edit/:id', isAuthenticated, checkCategoryOwnership, async (req, res) => {
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
router.put('/categories/:id', isAuthenticated, checkCategoryOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    
    if (!name) {
      return res.status(400).send('Nome da categoria é obrigatório');
    }
    
    const result = await pool.query(
      'UPDATE categories SET name = $1, color = $2 WHERE id = $3 RETURNING *', 
      [name, color || null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Categoria não encontrada');
    }
    
    res.redirect('/categories');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar categoria');
  }
});

// Deletar categoria
router.delete('/categories/:id', isAuthenticated, checkCategoryOwnership, async (req, res) => {
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

// Listar todas as tarefas do usuário logado
router.get('/tasks', isAuthenticated, async (req, res) => {
  try {
    // Obter o ID do usuário da sessão
    const userId = req.session.userId;
    
    console.log('Usuário logado ID:', userId); // Log para debug
    
    // Buscar apenas as tarefas do usuário logado
    const { rows } = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id', 
      [userId]
    );
    
    console.log('Tarefas encontradas:', rows.length); // Log para debug
    
    res.render('pages/tasks', { tasks: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar tarefas');
  }
});

// Formulário nova tarefa
router.get('/tasks/new', isAuthenticated, async (req, res) => {
  try {
    // Buscar categorias do usuário logado
    const userId = req.session.userId;
    const { rows: categories } = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    
    // Se não houver categorias, redirecionar para criar uma categoria primeiro
    if (categories.length === 0) {
      req.flash('warning', 'Você precisa criar pelo menos uma categoria antes de criar uma tarefa.');
      return res.redirect('/categories/new');
    }
    
    // Verificar se há uma categoria pré-selecionada
    const preSelectedCategoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    
    res.render('pages/new-task', { 
      categories,
      preSelectedCategoryId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar formulário de nova tarefa');
  }
});

// Criar nova tarefa
router.post('/tasks', isAuthenticated, async (req, res) => {
  try {
    // Obter dados do formulário
    const { title, description, due_date, priority, status, category_id } = req.body;
    
    // Obter ID do usuário da sessão
    const user_id = req.session.userId;
    
    if (!title || !category_id) {
      return res.status(400).send('Título e categoria são obrigatórios');
    }
    
    // Iniciar uma transação
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Inserir a tarefa
      const taskResult = await client.query(
        'INSERT INTO tasks (title, description, user_id, due_date, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description || '', user_id, due_date || null, priority || 'medium', status || 'pending']
      );
      
      const task = taskResult.rows[0];
      
      // Vincular a tarefa à categoria
      await client.query(
        'INSERT INTO task_categories (task_id, category_id) VALUES ($1, $2)',
        [task.id, category_id]
      );
      
      await client.query('COMMIT');
      res.redirect('/tasks');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar tarefa');
  }
});

// Formulário editar tarefa
router.get('/tasks/edit/:id', isAuthenticated, checkTaskOwnership, async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar a tarefa
    const { rows: taskRows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (taskRows.length === 0) return res.status(404).send('Tarefa não encontrada');
    
    const task = taskRows[0];
    
    // Buscar categorias do usuário
    const userId = req.session.userId;
    const { rows: categories } = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [userId]
    );
    
    // Buscar a categoria atual da tarefa
    const { rows: taskCategories } = await pool.query(
      'SELECT category_id FROM task_categories WHERE task_id = $1 LIMIT 1',
      [id]
    );
    
    const selectedCategoryId = taskCategories.length > 0 ? taskCategories[0].category_id : null;
    
    res.render('pages/edit-task', { 
      task, 
      categories, 
      selectedCategoryId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar tarefa');
  }
});

// Atualizar tarefa
router.put('/tasks/:id', isAuthenticated, checkTaskOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority, status, category_id } = req.body;
    
    if (!title || !category_id) {
      return res.status(400).send('Título e categoria são obrigatórios');
    }
    
    // Iniciar uma transação
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Atualizar a tarefa
      const result = await client.query(
        'UPDATE tasks SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [title, description || '', due_date || null, priority || 'medium', status || 'pending', id]
      );
      
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).send('Tarefa não encontrada');
      }
      
      // Remover associações de categoria existentes
      await client.query('DELETE FROM task_categories WHERE task_id = $1', [id]);
      
      // Adicionar nova associação de categoria
      await client.query(
        'INSERT INTO task_categories (task_id, category_id) VALUES ($1, $2)',
        [id, category_id]
      );
      
      await client.query('COMMIT');
      res.redirect('/tasks');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar tarefa');
  }
});

// Deletar tarefa
router.delete('/tasks/:id', isAuthenticated, checkTaskOwnership, async (req, res) => {
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

// Marcar tarefa como concluída
router.put('/tasks/:id/complete', isAuthenticated, checkTaskOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Atualizar o status da tarefa para 'completed'
    const result = await pool.query(
      'UPDATE tasks SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['completed', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Tarefa não encontrada');
    }
    
    // Redirecionar de volta para a página de tarefas
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao concluir tarefa');
  }
});

module.exports = router;
