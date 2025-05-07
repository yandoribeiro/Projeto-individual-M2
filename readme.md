# Web Application Document - Projeto Individual - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final._**

## Nome do Projeto

#### Autor do projeto

## Sumário

1. [Introdução](#c1)  
2. [Visão Geral da Aplicação Web](#c2)  
3. [Projeto Técnico da Aplicação Web](#c3)  
4. [Desenvolvimento da Aplicação Web](#c4)  
5. [Referências](#c5)  

<br>

## <a name="c1"></a>1. Introdução (Semana 01)

  Na era digital, a crescente demanda por produtividade tem tornado a gestão de tarefas um desafio constante. Muitas pessoas enfrentam dificuldades para organizar suas atividades acadêmicas e profissionais, resultando em perda de eficiência e aumento do estresse. Diante desse cenário, este projeto propõe o desenvolvimento de um sistema web de gerenciamento de tarefas, visando auxiliar usuários a melhorar sua organização e desempenho.
  
  O sistema oferecerá funcionalidades essenciais como criação e categorização de tarefas, definição de prazos e prioridades, além de acompanhamento visual do progresso. Técnicamente, será implementado com um banco de dados relacional para armazenamento seguro das informações, uma API  para integração entre frontend e backend, e uma interface intuitiva desenvolvida com foco na experiência do usuário.
  
  Como projeto acadêmico, esta solução aplica conceitos fundamentais de computação e design abordados no curso. O público-alvo principal inclui estudantes e profissionais que necessitam de uma ferramenta simples porém eficaz para gerenciar suas rotinas. Ao centralizar e automatizar a organização de tarefas, o sistema permitirá que os usuários alcancem maior produtividade com menor esforço organizacional.


---

## <a name="c2"></a>2. Visão Geral da Aplicação Web

### 2.1. Personas (Semana 01)

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


### 2.2. User Stories (Semana 01)

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

### 3.1. Modelagem do banco de dados  (Semana 3)

*Posicione aqui os diagramas de modelos relacionais do seu banco de dados, apresentando todos os esquemas de tabelas e suas relações. Utilize texto para complementar suas explicações, se necessário.*

*Posicione também o modelo físico com o Schema do BD (arquivo .sql)*

### 3.1.1 BD e Models (Semana 5)
*Descreva aqui os Models implementados no sistema web*

### 3.2. Arquitetura (Semana 5)

*Posicione aqui o diagrama de arquitetura da sua solução de aplicação web. Atualize sempre que necessário.*

**Instruções para criação do diagrama de arquitetura**  
- **Model**: A camada que lida com a lógica de negócios e interage com o banco de dados.
- **View**: A camada responsável pela interface de usuário.
- **Controller**: A camada que recebe as requisições, processa as ações e atualiza o modelo e a visualização.
  
*Adicione as setas e explicações sobre como os dados fluem entre o Model, Controller e View.*

### 3.3. Wireframes (Semana 03)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização).*

### 3.4. Guia de estilos (Semana 05)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução.*


### 3.5. Protótipo de alta fidelidade (Semana 05)

*Posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização).*

### 3.6. WebAPI e endpoints (Semana 05)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.*  

### 3.7 Interface e Navegação (Semana 07)

*Descreva e ilustre aqui o desenvolvimento do frontend do sistema web, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

---

## <a name="c4"></a>4. Desenvolvimento da Aplicação Web (Semana 8)

### 4.1 Demonstração do Sistema Web (Semana 8)

*VIDEO: Insira o link do vídeo demonstrativo nesta seção*
*Descreva e ilustre aqui o desenvolvimento do sistema web completo, explicando brevemente o que foi entregue em termos de código e sistema. Utilize prints de tela para ilustrar.*

### 4.2 Conclusões e Trabalhos Futuros (Semana 8)

*Indique pontos fortes e pontos a melhorar de maneira geral.*
*Relacione também quaisquer outras ideias que você tenha para melhorias futuras.*



## <a name="c5"></a>5. Referências

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

---
---
