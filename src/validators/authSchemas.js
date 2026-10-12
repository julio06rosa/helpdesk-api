const { z } = require('zod');

const registerSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(3)
    .max(100),

  email: z
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .max(72),
});

const loginSchema = z.strictObject({
  email: z
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(1)
    .max(72),
});

module.exports = {
  registerSchema,
  loginSchema,
};