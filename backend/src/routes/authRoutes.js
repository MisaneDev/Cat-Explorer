const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Criptografia 
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = 'CHAVE_SECRETA'; // Em prod, usar .env

// ROTA + CONTROLADOR 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Validação de credenciais (sua lógica aqui)
    const user = await User.findByCredentials(email, password); 

    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Geração do Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // 3. Resposta de sucesso
    res.json({ token, user: { id: user.id, email: user.email } });
});

// Rota auxiliar para criar usuário 
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await User.create(email, hashedPassword);
        res.json({ message: 'Usuário criado!' });
    } catch (e) {
        res.status(400).json({ error: 'Erro ao criar usuário' });
    }
});

module.exports = router;