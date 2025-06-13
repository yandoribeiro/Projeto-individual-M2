# Web Application Document - Projeto Individual - Módulo 2 - Inteli

## Task +

#### Yan de Oliveira Ribeiro

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução

  Na era digital, a crescente demanda por produtividade tem tornado a gestão de tarefas um desafio constante. Muitas pessoas enfrentam dificuldades para organizar suas atividades acadêmicas e profissionais, resultando em perda de eficiência e aumento do estresse. Diante desse cenário, este projeto propõe o desenvolvimento de um sistema web de gerenciamento de tarefas, visando auxiliar usuários a melhorar sua organização e desempenho.
  
  O sistema oferecerá funcionalidades essenciais como criação e categorização de tarefas, definição de prazos e prioridades, além de acompanhamento visual do progresso. Técnicamente, será implementado com um banco de dados relacional para armazenamento seguro das informações, uma API  para integração entre frontend e backend, e uma interface intuitiva desenvolvida com foco na experiência do usuário.
  
  Como projeto acadêmico, esta solução aplica conceitos fundamentais de computação e design abordados no curso. O público-alvo principal inclui estudantes e profissionais que necessitam de uma ferramenta simples porém eficaz para gerenciar suas rotinas. Ao centralizar e automatizar a organização de tarefas, o sistema permitirá que os usuários alcancem maior produtividade com menor esforço organizacional.


---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas

<img height=500px src="https://github.com/user-attachments/assets/9e2f9b5d-b17c-4cd8-b15b-817f6bae1b27">


**Nome:** Pedro

**Idade:** 18 anos

**Sexo:** Masculino

**Locação:** Guaratinguetá

**Ocupação:** Estudante

**Sobre:** Pedro é um jovem que recentemente começou a cursar Engenharia Mecânica na UNESP. Por causa da faculdade, ele passou a morar sozinho em outra cidade e tem dificuldade para cuidar da casa, o que, somado às obrigações como estudante, tem deixado sua rotina muito desorganizada e estressante. Além disso, ele se sente perdido sobre como organizar suas tarefas, e muitas vezes enfrenta problemas com prazos. Assim, tudo isso vem o deixando muito sobrecarregado, o que diminui sua produtividade e consequentemente gera mais acúmulo de tarefas.

**Dores:** 
Falta de um espaço para anotar suas tarefas;
Dificuldade em organizar prioridades;
Problema para mapear prazos.


**Solução:**
Tarefas anotadas e organizadas;
Prioridades definidas com base no prazo de entrega;
Interface intuitiva que melhora a visualização de tarefas.

**Frase:**
“Me sinto muito sobrecarregado com minhas tarefas, sinto que não vou dar conta da faculdade.”


### 2.2. User Stories

**US01 -** “ Eu, como estudante universitário, sinto falta de um lugar para armazenar minhas tarefas.”

**US02 -** “Eu, como estudante universitário, não consigo organizar a prioridade de minhas tarefas.”

**US03 -** “Eu, como estudante universitário, preciso de um local para visualizar minhas tarefas.”

## Método INVEST: US03 ## 

**Independente:** A visualização das informações do produto não depende das informações contidas nele.

**Negociável:** Uma interface esteticamente agradável pode tomar muitas formas, não há um padrão a ser seguido, contanto que o sistema mostre o necessário.

**Valiosa:** Por ser um sistema que organiza tarefas, sabe-se que a visualização das tarefas é o ponto mais importante do projeto.

**Estimável:** É possível estimar o esforço e os recursos gastos para criar um produto que supra a necessidade descrita.

**Sob medida:** A história é bem sucinta ao descrever a demanda, tornando a tarefa direta e clara.

**Testável:** A história é clara em sua necessidade, o que facilita o testa, já que se sabe exatamente qual a questão tratada.



---

## <a name="c3"></a>3. Projeto da Aplicação Web

### 3.1. Modelagem do banco de dados

#### Modelo Relacional:

![Captura de tela 2025-05-08 195459](https://github.com/user-attachments/assets/03bb6398-19f9-4fdf-a7a4-2677bbeb78aa)

Como o objetivo do sistema é gerenciar e organizar tarefas de forma adaptável, foram criadas quatro tabelas:

- users: Contém as informações dos usuários, como nome e e-mail;

- tasks: Armazena as taks criadas pelos usuários utilizando informações como título, descrição, data limite, prioridade, status, data em que foi criada e data da última atualização;

- categories: Organiza as tabelas por temas ou grupos definidos pelos usuários por meio do nome da categoria, data que foi criada e id estrangeiro para determinar quem criou a categoria;

- tasks_categories: Faz a ligação entre tarefas e categorias, permitindo que uma tarefa pertença a várias categorias (relação muitos-para-muitos).

#### Modelo Físico:

```
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('pending', 'completed', 'canceled');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR NOT NULL UNIQUE
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE task_categories (
  task_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (task_id, category_id)
);

ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE categories ADD CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_task FOREIGN KEY (task_id) REFERENCES tasks(id);
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_category FOREIGN KEY (category_id) REFERENCES categories(id);
```

### 3.1.1 BD e Models

No sistema web desenvolvido com base na arquitetura MVC (Model-View-Controller), a camada Model representa a estrutura e o relacionamento dos dados com o banco de dados. Abaixo estão descritos os models que compõem o sistema:

#### Usuários (users)
O model users representa os usuários que acessam o sistema para gerenciar e visualizar suas tarefas. Contém os seguintes atributos:
- id - identificador do usuário
- username - nome do usuário

#### Tarefas (tasks)
O model tasks representa as atividades atribuídas aos usuários, como lições de casa, afazeres domésticos, lembretes ou projetos. Contém os seguintes atributos:
- id - identificador da tarefa
- title - título da tarefa
- description - descrição da atividade
- due_date - prazo da tarefa
- priority - prioridade da atividade (alta, média ou baixa)
- status - situação da tarefa (pendente ou concluída)
- created_at - data de criação da tarefa
- updated_at - data de atualização da tarefa (se houver)
- user_id - chave estrangeira para os usuários

#### Categorias (categories)
O model categories permite a classificação das tarefas por temas criados pelo usuário. Contém os seguintes atributos:
- id - identificador da categoria
- name - nome da categoria
- created_at - data de criação da categoria
- user_id - chave estrangeira para os usuários

#### Relação tarefas-categorias (task_categories)
Esse model implementa a relação muitos-para-muitos entre tarefas e categorias. Ele permite que uma tarefa seja classificada em mais de uma categoria e que uma categoria agrupe várias tarefas. Contém os seguintes atributos:
- task_id - chave estrangeira para a tarefa
- category_id - chave estrangeira para a categoria
- created_at - data de criação da relação


### 3.2. Arquitetura
O diagrama de arquitetura abaixo mostra como os dados fluem pelo sistema, tornando mais fácil a compreensão da lógica por trás dele.
![image](https://github.com/user-attachments/assets/b28c45f6-1e86-45e3-b7f4-341703d925c8)


### 3.3. Wireframes

![Wireframe-Home](https://github.com/user-attachments/assets/6f26ae68-403c-4176-9b8b-e29de3c9fe39)

O wireframe da tela principal do site (início), foi pensada, com base na US03, para mostrar ao usuário as informações mais importantes do site de uma vez, permitindo que ele tenha uma clara visualização de seus deveres e progresso por meio de uma coluna que contém suas tarefas pendentes e um gráfico que mostra sua quantidade de tarefas dia após dia. Com isso, o usuário poderá acessar informações vitais rapidamente, ou optar por uma visualização mais detalhada selecionando uma das opções encontradas à esquerda do site: tarefas, categorias e relatórios. 

![Wireframe-Categorias](https://github.com/user-attachments/assets/a091d752-c244-4b02-80b0-608f2cf2f08f)

Esse é o wireframe da aba categorias, que foi baseada na US01 para ser desenvolvido. Nessa tela, o usuário pode acessar suas categorias e conectar suas taks a elas. O intuido dessa tela é facilitar a organização e anotação das tarefas, de modo que o usuário poderá organizar melhor suas tarefas, encontrà-las de forma mais fácil e até mesmo vizualizar melhor quais serão suas prioridades. 


### 3.4. Guia de estilos (Semana 05)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints

Segue o link para um documento contendo a explicação dos endpoints relacionados ao projeto:
https://docs.google.com/document/d/1Qh0XPUv6BALtVt9tQLXQG64ORV6hQG3RD-lf3Uwdweo/edit?usp=sharing

### 3.7 Interface e Navegação

Para desenvolver o frontend do projeto, foram utilizados arquivos .ejs e .css para estilizar o sistema e permitir sua interação com o usuário. Ao final do desenvolvimento, a aplicação contém 4 páginas principais:

![image](https://github.com/user-attachments/assets/a1497448-36a0-4f8f-b36f-f7dee09366b4)
Essa é a tela de login do site, onde o usuário deve inserir seu nome de usuário e senha ou criar uma conta caso não tenha. Ela é essencial para o sistema pois o usuário pode acessar apenas suas tarefas e categorias.

![image](https://github.com/user-attachments/assets/925cf817-f091-41a4-acca-14813098933b)
![image](https://github.com/user-attachments/assets/d72ee133-0a7d-440c-a078-4d1dec6e15cb)
Essa imagem é referente à página de início do site, nela o usuário pode acessar suas tarefas de forma rápida e navegar entre as outras páginas para realizar alterações ou adicionar tarefas e categorias.

![image](https://github.com/user-attachments/assets/41f40275-d622-41e9-a7e3-c16e47ce9c18)
A página de tarefas permite que o usuário apague , crie ou edite suas tarefas, as duas últimas são feitas por meio do seguinte modelo:
![image](https://github.com/user-attachments/assets/ca2b1666-b519-4cff-8928-2fa7d07f09e4)
Um detalhe importante é que nessa página o usuário consegue clicar no botão "concluir" que altera o status da tarefa e "risca" ela, como pode ser visto na tarefa "limpar a estante".

![image](https://github.com/user-attachments/assets/307bfd33-d624-49ac-9831-83cbbec08263)
Por fim, a página de categorias mostra as categorias do usuário, as tarefas atreladas a ela e permite alterar, criar ou excluí-las. Para adicionar ou editar uma categoria, o sistema faz uso do seguinte formulário:
![image](https://github.com/user-attachments/assets/31e7cdad-d47e-440d-9cf9-c477919691c1)
Nele o usuário deve criar o nome da categoria e adicionar uma cor a ela, de modo a facilitar sua diferenciação. Além disso, é possível ver algumas dicas para a criação de categorias, que incentivam o usuário a fazer uso do sistema e organziar melhor suas tarefas. 

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros

O desenvolvimento do sistema Task+ permitiu aplicar, de forma prática, diversos conceitos aprendidos durante o módulo, como modelagem de banco de dados relacional, arquitetura MVC, integração entre frontend e backend e uso de rotas e endpoints. O projeto cumpriu seu objetivo principal: oferecer uma ferramenta simples e funcional para organização de tarefas, atendendo às necessidades identificadas nas user stories e validando as dores da persona definida.
#### Trabalhos Futuros

- Sistema de login com autenticação segura: Implementação de autenticação com senha criptografada e sessões protegidas.

- Filtro e ordenação de tarefas: Permitir que o usuário filtre tarefas por data, prioridade ou categoria.

- Notificações e lembretes: Integração com e-mail ou sistema de alertas para lembrar o usuário de prazos importantes.

- Dashboard analítico: Expansão do gráfico inicial para oferecer estatísticas mais detalhadas sobre produtividade, tempo médio para conclusão e categorias mais utilizadas.

## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---
