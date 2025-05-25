const express = require('express');
const router = express.Router();

const TarefaController = require('../controllers/TarefaController');
const UserController = require('../controllers/UserController');  // importe o UserController
const CategoriaController = require('../controllers/CategoriaController');
const TaskCategoryController = require('../controllers/TaskCategoryController'); // IMPORTAÇÃO ADICIONADA

// Rotas para tarefas
router.post('/tasks', TarefaController.criarTarefa);
router.get('/tasks', TarefaController.listarTarefas);
router.put('/tasks/:id', TarefaController.editarTarefa);
router.delete('/tasks/:id', TarefaController.excluirTarefa);

// Rotas para usuários
router.post('/usuarios', UserController.criarUsuario);
router.get('/usuarios', UserController.listarUsuarios);
router.put('/users/:id', UserController.atualizarUsuario);
router.delete('/users/:id', UserController.excluirUsuario);

// Rotas para categorias
router.post('/categories', CategoriaController.criarCategoria);
router.get('/categories/:user_id', CategoriaController.listarCategorias);
router.put('/categories/:id', CategoriaController.editarCategoria);
router.delete('/categories/:id', CategoriaController.excluirCategoria);

// Rotas para a tabela de junção task_categories
router.post('/task-categories', TaskCategoryController.adicionarCategoriaATarefa);
router.delete('/task-categories', TaskCategoryController.removerCategoriaDaTarefa);
router.get('/task-categories/:task_id', TaskCategoryController.listarCategoriasDaTarefa);

module.exports = router;
