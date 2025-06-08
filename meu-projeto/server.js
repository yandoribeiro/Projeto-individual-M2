const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');

const routes = require('./routes');
const frontRoutes = require('./routes/front');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de sessão
app.use(session({
  secret: 'sua_chave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 3600000, // 1 hora
    secure: false // Defina como true apenas se estiver usando HTTPS
  }
}));

// Middleware para disponibilizar informações do usuário para todas as views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  console.log('Session middleware - userId:', req.session.userId); // Log para debug
  next();
});

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rotas
app.use('/api', routes);
app.use('/', frontRoutes);

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
