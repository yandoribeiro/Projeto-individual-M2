const express = require('express');
const app = express();
const routes = require('./routes'); // importa seu index.js da pasta routes

app.use('/api', routes); // todas as rotas começam com /api

// Rota direta para "/"
app.get('/', (req, res) => {
  res.send('Está funcionando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
