const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');

async function createComment(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        message: 'Chamado não encontrado.',
      });
    }

    // Usuário comum só comenta nos próprios chamados
    if (
      req.user.role === 'user' &&
      ticket.userId !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Você não tem acesso a este chamado.',
      });
    }

    // Técnico só comenta em chamado atribuído a ele
    if (
      req.user.role === 'technician' &&
      ticket.technicianId !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Este chamado não está atribuído a você.',
      });
    }

    const comment = await Comment.create({
      message,
      ticketId: ticket.id,
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Comentário adicionado com sucesso.',
      comment,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao adicionar comentário.',
    });
  }
}

module.exports = {
  createComment,
};