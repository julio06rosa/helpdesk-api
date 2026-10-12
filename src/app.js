const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();


// Segurança HTTP
app.use(helmet());


// CORS
// Por enquanto aberto para desenvolvimento.
// Antes de publicar, vamos restringir ao endereço do frontend.
app.use(cors());


// Limita o tamanho do JSON recebido
app.use(express.json({
  limit: '10kb',
}));


// Limite geral da API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
});


// Limite específico para tentativas de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,

  // Login que deu certo não consome tentativa
  skipSuccessfulRequests: true,

  message: {
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
  },
});


// Aplica limite geral
app.use(apiLimiter);


// Rota inicial
app.get('/', (req, res) => {
  res.json({
    message: 'Help Desk API funcionando!',
  });
});


// Rotas de usuários
app.use('/users', userRoutes);


// Proteção extra somente no login
app.use('/auth/login', loginLimiter);


// Rotas de autenticação
app.use('/auth', authRoutes);


// Rotas de chamados
app.use('/tickets', ticketRoutes);


module.exports = app;