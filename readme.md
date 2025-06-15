<h1>📋 Task +</h1>

  <p>O projeto consiste em um sistema de gerenciamento de tarefas desenvolvido com JavaScript no frontend, Node.js no backend e banco de dados PostgreSQL via Supabase.</p>

  <h2>🚀 Funcionalidades</h2>
  <ul>
    <li>✅ Criar, consultar, atualizar e deletar tarefas</li>
    <li>🕒 Marcar tarefas como concluídas ou pendentes</li>
    <li>🔍 Filtrar tarefas por categorias</li>
    <li>🔒 Acesso com username e senha</li>
   
  </ul>

  <h2>🛠️ Tecnologias Utilizadas</h2>
  <ul>
    <li><strong>Frontend:</strong> HTML, CSS, JavaScript</li>
    <li><strong>Backend:</strong> Node.js (Express)</li>
    <li><strong>Banco de Dados:</strong> PostgreSQL (via <a href="https://supabase.io" target="_blank">Supabase</a>)</li>
    <li><strong>Hospedagem/Serviços:</strong> Supabase Auth e Supabase DB</li>
  </ul>




## 📁 Estrutura de Pastas

```text
gerenciador-de-tarefas/
├── assets/              # Arquivos estáticos como imagens, CSS, JS
├── config/              # Configurações da aplicação
├── controllers/         # Controladores da aplicação
├── documentos/          # Documentação adicional ou arquivos auxiliares
├── models/              # Modelos de dados
├── node_modules/        # Dependências instaladas via npm
├── routes/              # Definições de rotas
├── scripts/             # Scripts auxiliares
├── services/            # Lógica de serviços (ex: comunicação com APIs)
├── tests/               # Testes automatizados
├── views/               # Templates da interface do usuário
├── .env.example         # Variáveis de ambiente
├── app.js               # Inicializa o servidor e gerencia rotas
├── .gitignore           # Arquivos e pastas ignorados pelo Git
├── jest.config.js       # Configuração do Jest para testes
├── package-lock.json    # Lockfile do npm
├── package.json         # Configurações e dependências do projeto
├── readme.md            # Documentação do projeto
├── rest.http            # Requisições HTTP para testes
└── server.js            # Arquivo principal do servidor
```





<h2>📦 Como Rodar o Projeto Localmente</h2>

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/yandoribeiro/Projeto-individual-M2
   cd gerenciador-de-tarefas

3. **Instale as dependências: Certifique-se de que você tem o Node.js instalado. Em seguida, execute:**
  ```bash
  npm install
  ```

3. **Configure as variáveis de ambiente: Crie um arquivo .env na raiz do projeto (se ainda não existir) e configure as variáveis de ambiente , com os dados da seu banco de dados no supabase,conforme o exemplo abaixo:**
  ```bash
  DB_USER= "seu_usuario"
  DB_HOST= "seu_host"
  DB_DATABASE= "seu_banco"
  DB_PASSWORD= "sua_senha"
  DB_PORT= "sua_porta"
  DB_SSL= "true"
  PORT= 3000
  ```

4. **Execute o script de inicialização do banco de dados: Certifique-se de que o banco de dados PostgreSQL está configurado e rodando. Depois, execute o script SQL para criar as tabelas:**
  ```bash
  node scripts/runSQLScript.js
  ``` 
5. **Inicie o servidor: Execute o comando abaixo para iniciar o servidor:**
  ```bash
  node server.js
  ```
6.**Acesse a aplicação: Abra o navegador e acesse:**
  ```bash
  http://localhost:3000
  ``` 
