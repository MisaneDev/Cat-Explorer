const jwt = require('jsonwebtoken');

// ⚠️ MANTENHA ESTA CHAVE CONSISTENTE com o authRoutes.js
const JWT_SECRET = 'CHAVE_SECRETA'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Se o token for inválido, o Front-end deve ser forçado a deslogar
            return res.status(403).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
        }
        
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };