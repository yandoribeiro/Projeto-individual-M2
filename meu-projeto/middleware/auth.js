// middleware/auth.js
function isAuthenticated(req, res, next) {
  // Verifica se o usuário está autenticado (usando session)
  if (req.session && req.session.userId) {
    console.log('Usuário autenticado, ID:', req.session.userId); // Log para debug
    return next();
  }
  
  console.log('Usuário não autenticado, redirecionando para login'); // Log para debug
  
  // Se não estiver autenticado, redireciona para a página de login
  res.redirect('/login');
}

module.exports = { isAuthenticated };
