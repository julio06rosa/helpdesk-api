require('dotenv').config();

const app = require('./src/app');
const sequelize = require('./src/config/database');

const User = require('./src/models/User');
const Ticket = require('./src/models/Ticket');
const Comment = require('./src/models/Comment');


// ==============================
// RELACIONAMENTOS
// ==============================


// Usuário que abriu o chamado
User.hasMany(Ticket, {
  foreignKey: 'userId',
  as: 'tickets',
});

Ticket.belongsTo(User, {
  foreignKey: 'userId',
  as: 'requester',
});


// Técnico responsável pelo chamado
User.hasMany(Ticket, {
  foreignKey: 'technicianId',
  as: 'assignedTickets',
});

Ticket.belongsTo(User, {
  foreignKey: 'technicianId',
  as: 'technician',
});


// Comentários do chamado
Ticket.hasMany(Comment, {
  foreignKey: 'ticketId',
  as: 'comments',
});

Comment.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket',
});


// Usuário que escreveu o comentário
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
});


// ==============================
// SERVIDOR
// ==============================

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log('Banco de dados conectado com sucesso.');

    await sequelize.sync();

    console.log('Tabelas sincronizadas com sucesso.');

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
}

startServer();