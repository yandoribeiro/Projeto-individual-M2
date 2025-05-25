const express = require('express');
const router = express.Router();
const TaskCategoryController = require('../controllers/TaskCategoryController');

router.post('/', TaskCategoryController.adicionarCategoriaATarefa);
router.delete('/', TaskCategoryController.removerCategoriaDaTarefa);
router.get('/:task_id', TaskCategoryController.listarCategoriasDaTarefa);

module.exports = router;
