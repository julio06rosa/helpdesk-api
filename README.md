# Help Desk API

API REST para gerenciamento de chamados de suporte técnico, desenvolvida com Node.js, Express e banco de dados relacional.

Desenvolvi este projeto para praticar criação de APIs, autenticação, controle de acesso e integração com banco de dados. A ideia é representar um fluxo simples de suporte: o usuário abre um chamado, um técnico assume o atendimento e o histórico pode ser acompanhado por meio de comentários e mudanças de status.

O projeto ainda está em desenvolvimento.

## Tecnologias

- **Node.js e Express** — servidor e rotas da API
- **JavaScript** — linguagem utilizada
- **MySQL ou MariaDB** — banco de dados relacional
- **Sequelize** — models e acesso ao banco
- **JWT e bcrypt** — autenticação e hash de senhas
- **Zod** — validação de dados
- **Helmet e express-rate-limit** — proteções HTTP e limites de requisições

## Funcionalidades

- Cadastro de usuários e login com JWT
- Abertura, listagem, consulta e edição de chamados
- Prioridades: `low`, `medium` e `high`
- Status: `open`, `in_progress`, `resolved` e `closed`
- Atribuição de chamados a técnicos e opção de assumir um chamado disponível
- Comentários vinculados aos chamados
- Permissões para usuários, técnicos e administradores
- Validação de dados recebidos pela API
- Limites de requisições e tentativas de login

### Perfis de acesso

| Perfil | O que pode fazer |
|---|---|
| `user` | Criar e consultar os próprios chamados, editar chamados abertos e comentar neles |
| `technician` | Consultar chamados, assumir atendimentos disponíveis, comentar e alterar o status dos chamados atribuídos |
| `admin` | Consultar e editar todos os chamados, atribuir técnicos, alterar status e comentar |

O cadastro pela API cria usuários com o perfil `user`. Ainda não existe uma rota para promover um usuário a técnico ou administrador; esses perfis precisam ser configurados no banco de dados durante o desenvolvimento.

## Como executar

### Requisitos

- Node.js e npm
- MySQL ou MariaDB em execução
- Git, para clonar o repositório
- Postman, Insomnia ou outra ferramenta para enviar requisições (opcional)

**1. Clone o repositório:**

```bash
git clone https://github.com/julio06rosa/helpdesk-api.git
cd helpdesk-api
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Crie o banco de dados:**

```sql
CREATE DATABASE helpdesk;
```

**4. Configure as variáveis de ambiente:**

Copie `.env.example` para um novo arquivo chamado `.env` e preencha os dados de conexão.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=helpdesk
DB_USER=seu_usuario
DB_PASSWORD=sua_senha

JWT_SECRET=defina_uma_chave_secreta_forte
JWT_EXPIRES_IN=8h
```

O arquivo `.env` não deve ser enviado ao GitHub. Ele já está listado no `.gitignore` do projeto.

**5. Inicie o servidor:**

Para desenvolvimento, com reinício automático ao salvar alterações:

```bash
npm run dev
```

Para execução normal:

```bash
npm start
```

Por padrão, a API fica disponível em `http://localhost:3000`. A rota `GET /` retorna uma mensagem indicando que o servidor está funcionando.

Na inicialização, o Sequelize conecta ao banco e sincroniza os modelos existentes.

## Endpoints

### Usuários e autenticação

| Método | Rota | Ação |
|---|---|---|
| `POST` | `/users` | Cadastrar usuário |
| `POST` | `/auth/login` | Fazer login e obter o token JWT |

### Chamados

Todas as rotas abaixo exigem autenticação.

| Método | Rota | Ação |
|---|---|---|
| `POST` | `/tickets` | Criar chamado |
| `GET` | `/tickets` | Listar chamados permitidos para o perfil |
| `GET` | `/tickets/:id` | Consultar chamado |
| `PATCH` | `/tickets/:id` | Editar título, descrição ou prioridade |
| `POST` | `/tickets/:id/comments` | Adicionar comentário |
| `PATCH` | `/tickets/:id/status` | Alterar status (técnico responsável ou administrador) |
| `PATCH` | `/tickets/:id/assign` | Atribuir técnico (administrador) |
| `PATCH` | `/tickets/:id/claim` | Assumir chamado aberto e sem técnico (técnico) |

## Exemplos de requisições

### Cadastro

`POST /users`

```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha12345"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "joao@exemplo.com",
  "password": "senha12345"
}
```

Depois do login, utilize o token retornado no cabeçalho das rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

### Criar chamado

`POST /tickets`

```json
{
  "title": "Erro ao acessar o sistema",
  "description": "O sistema apresenta uma mensagem de erro ao realizar o login.",
  "priority": "high"
}
```

Se a prioridade não for informada, o valor padrão é `medium`.

### Alterar status

`PATCH /tickets/1/status`

```json
{
  "status": "in_progress"
}
```

### Comentar em um chamado

`POST /tickets/1/comments`

```json
{
  "message": "Estamos verificando o problema informado."
}
```

## Estrutura do projeto

```text
helpdesk-api/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

As rotas definem os endpoints, os controllers concentram as operações da aplicação e os models representam os dados armazenados. Os middlewares são utilizados para autenticação, permissões e validações.

## Próximos passos

- Criar testes automatizados para autenticação e chamados
- Documentar melhor os retornos e erros dos endpoints
- Adicionar migrations para controlar alterações no banco
- Revisar as configurações de segurança antes de disponibilizar a API em produção

## Autor

**Júlio César Duarte da Rosa**

Estudante de Engenharia de Software.
