const { z } = require('zod');

const createTicketSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(3)
    .max(150),

  description: z
    .string()
    .trim()
    .min(5)
    .max(5000),

  priority: z
    .enum(['low', 'medium', 'high'])
    .optional(),
});

const updateTicketSchema = z
  .strictObject({
    title: z
      .string()
      .trim()
      .min(3)
      .max(150)
      .optional(),

    description: z
      .string()
      .trim()
      .min(5)
      .max(5000)
      .optional(),

    priority: z
      .enum(['low', 'medium', 'high'])
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined,
    {
      message: 'Informe pelo menos um campo para atualizar.',
    }
  );

const updateStatusSchema = z.strictObject({
  status: z.enum([
    'open',
    'in_progress',
    'resolved',
    'closed',
  ]),
});

const createCommentSchema = z.strictObject({
  message: z
    .string()
    .trim()
    .min(1)
    .max(3000),
});

const ticketIdSchema = z.strictObject({
  id: z
    .string()
    .regex(/^[1-9]\d*$/, 'O ID deve ser um número inteiro positivo.'),
});

const assignTechnicianSchema = z.strictObject({
  technicianId: z.number().int().positive(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  updateStatusSchema,
  createCommentSchema,
  ticketIdSchema,
  assignTechnicianSchema,
};