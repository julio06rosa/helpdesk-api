const bcrypt = require('bcrypt');
const User = require('../models/User');

async function createUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Nome, e-mail e senha são obrigatórios.',
      });
    }

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Já existe um usuário cadastrado com este e-mail.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao cadastrar usuário.',
    });
  }
}

module.exports = {
  createUser,
};