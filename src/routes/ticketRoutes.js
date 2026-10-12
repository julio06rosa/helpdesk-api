const express = require('express');

const {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  assignTechnician,
  claimTicket,
} = require('../controllers/ticketController');

const {createComment,} = require('../controllers/commentController');

const authMiddleware = require('../middlewares/authMiddleware');
const allowRoles = require('../middlewares/roleMiddleware');
const validateBody = require('../middlewares/validateBody');
const validateParams = require('../middlewares/validateParams');

const {
  createTicketSchema,
  updateTicketSchema,
  updateStatusSchema,
  createCommentSchema,
  ticketIdSchema,
  assignTechnicianSchema,
} = require('../validators/ticketSchemas');

const router = express.Router();


// Todas as rotas abaixo exigem login
router.use(authMiddleware);


// Criar chamado
router.post(
  '/',
  validateBody(createTicketSchema),
  createTicket
);


// Listar chamados
router.get(
  '/',
  listTickets
);


// Buscar chamado específico
router.get(
  '/:id',
  validateParams(ticketIdSchema),
  getTicketById
);


// Editar chamado
router.patch(
  '/:id',
  validateParams(ticketIdSchema),
  validateBody(updateTicketSchema),
  updateTicket
);


// Adicionar comentário
router.post(
  '/:id/comments',
  validateParams(ticketIdSchema),
  validateBody(createCommentSchema),
  createComment
);


// Alterar status
// Somente técnico ou administrador
router.patch(
  '/:id/status',
  validateParams(ticketIdSchema),
  allowRoles('technician', 'admin'),
  validateBody(updateStatusSchema),
  updateTicketStatus
);


router.patch(
  '/:id/assign',
  validateParams(ticketIdSchema),
  allowRoles('admin'),
  validateBody(assignTechnicianSchema),
  assignTechnician
);

router.patch(
  '/:id/claim',
  validateParams(ticketIdSchema),
  allowRoles('technician'),
  claimTicket
);

module.exports = router;