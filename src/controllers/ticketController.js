const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Técnico e administrador podem visualizar todos os chamados
function canViewAllTickets(role) {
  return role === 'technician' || role === 'admin';
}


// Criar chamado
async function createTicket(req, res) {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      userId: req.user.id,
    });

    return res.status(201).json({
      message: 'Chamado criado com sucesso.',
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao criar chamado.',
    });
  }
}


// Listar chamados
async function listTickets(req, res) {
  try {
    const where = canViewAllTickets(req.user.role)
      ? {}
      : { userId: req.user.id };

    const tickets = await Ticket.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(tickets);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao listar chamados.',
    });
  }
}


// Buscar chamado pelo ID
async function getTicketById(req, res) {
  try {
    const { id } = req.params;

    const where = {
      id,
    };

    // Usuário comum só pode visualizar os próprios chamados
    if (!canViewAllTickets(req.user.role)) {
      where.userId = req.user.id;
    }

    const ticket = await Ticket.findOne({
      where,
    });

    if (!ticket) {
      return res.status(404).json({
        message: 'Chamado não encontrado.',
      });
    }

    return res.status(200).json(ticket);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao buscar chamado.',
    });
  }
}


// Editar chamado
async function updateTicket(req, res) {
  try {
    const { id } = req.params;
    const { title, description, priority } = req.body;

    // Técnico pode atender o chamado,
    // mas não alterar os dados principais
    if (req.user.role === 'technician') {
      return res.status(403).json({
        message: 'Técnicos não podem alterar os dados principais do chamado.',
      });
    }

    const where = {
      id,
    };

    // Usuário comum só pode editar os próprios chamados
    // Administrador pode editar qualquer chamado
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const ticket = await Ticket.findOne({
      where,
    });

    if (!ticket) {
      return res.status(404).json({
        message: 'Chamado não encontrado.',
      });
    }

    // Usuário só pode editar enquanto o chamado estiver aberto
    if (
      req.user.role === 'user' &&
      ticket.status !== 'open'
    ) {
      return res.status(409).json({
        message: 'Chamados em atendimento ou finalizados não podem ser editados.',
      });
    }

    if (title !== undefined) {
      ticket.title = title;
    }

    if (description !== undefined) {
      ticket.description = description;
    }

    if (priority !== undefined) {
      ticket.priority = priority;
    }

    await ticket.save();

    return res.status(200).json({
      message: 'Chamado atualizado com sucesso.',
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atualizar chamado.',
    });
  }
}


// Alterar status do chamado
async function updateTicketStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        message: 'Chamado não encontrado.',
      });
    }

    // Técnico só pode alterar o status de chamados atribuídos a ele
    if (
      req.user.role === 'technician' &&
      ticket.technicianId !== req.user.id
    ) {
      return res.status(403).json({
        message: 'Este chamado não está atribuído a você.',
      });
    }

    ticket.status = status;

    await ticket.save();

    return res.status(200).json({
      message: 'Status do chamado atualizado com sucesso.',
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atualizar status do chamado.',
    });
  }
}


// Admin atribui um técnico a um chamado
async function assignTechnician(req, res) {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        message: 'Chamado não encontrado.',
      });
    }

    const technician = await User.findOne({
      where: {
        id: technicianId,
        role: 'technician',
      },
    });

    if (!technician) {
      return res.status(404).json({
        message: 'Técnico não encontrado.',
      });
    }

    ticket.technicianId = technician.id;

    await ticket.save();

    return res.status(200).json({
      message: 'Técnico atribuído ao chamado com sucesso.',
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atribuir técnico ao chamado.',
    });
  }
}


// Técnico assume um chamado disponível
async function claimTicket(req, res) {
  try {
    const { id } = req.params;

    // Só permite assumir:
    // - chamado sem técnico
    // - status open
    // Ao assumir, muda automaticamente para in_progress
    const [updatedRows] = await Ticket.update(
      {
        technicianId: req.user.id,
        status: 'in_progress',
      },
      {
        where: {
          id,
          technicianId: null,
          status: 'open',
        },
      }
    );

    if (updatedRows === 0) {
      const ticket = await Ticket.findByPk(id);

      if (!ticket) {
        return res.status(404).json({
          message: 'Chamado não encontrado.',
        });
      }

      if (ticket.technicianId !== null) {
        return res.status(409).json({
          message: 'Este chamado já possui um técnico responsável.',
        });
      }

      if (ticket.status !== 'open') {
        return res.status(409).json({
          message: 'Somente chamados abertos podem ser assumidos.',
        });
      }

      return res.status(409).json({
        message: 'O chamado não está disponível para ser assumido.',
      });
    }

    const ticket = await Ticket.findByPk(id);

    return res.status(200).json({
      message: 'Chamado assumido com sucesso.',
      ticket,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao assumir chamado.',
    });
  }
}


module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  assignTechnician,
  claimTicket,
};