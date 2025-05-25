-- Tabela users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL
);

-- Tabela tasks
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP,
  priority VARCHAR DEFAULT 'medium',
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT chk_status CHECK (status IN ('pending', 'completed', 'canceled'))
);

COMMENT ON COLUMN tasks.priority IS 'Options: low, medium, high';
COMMENT ON COLUMN tasks.status IS 'Options: pending, completed, canceled';

-- Tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

COMMENT ON COLUMN categories.name IS 'Nome da categoria (único)';
COMMENT ON COLUMN categories.user_id IS 'Dono da categoria (opcional, se for personalizada por usuário)';

-- Tabela task_categories (tabela de junção)
CREATE TABLE IF NOT EXISTS task_categories (
  task_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, category_id),
  CONSTRAINT fk_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);