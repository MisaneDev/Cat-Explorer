// backend/src/routes/catRoutes.js (Versão Final)

const express = require('express');
const router = express.Router();
const Cat = require('../models/catModel'); 
const { authenticateToken } = require('../config/authMiddleware'); 

// Cache simples
const cache = { data: null, timestamp: 0, TTL: 15000 }; 

// ROTA DE BUSCA (GET /api/cats) - Retorna os gatos filtrados ou todos
router.get('/cats', authenticateToken, async (req, res) => {
    // 1. CAPTURA O TERMO DE BUSCA 'q'
    const searchTerm = req.query.q;

    // Se houver busca (searchTerm), pulamos o cache para garantir a atualização
    if (!searchTerm && cache.data && (Date.now() - cache.timestamp < cache.TTL)) {
        console.log('[CACHE] Retornando dados do cache');
        return res.json(cache.data);
    }
    
    try {
        // 2. CHAMADA CORRIGIDA: Passa o ID do usuário e o termo de busca
        const cats = await Cat.getAll(req.user.id, searchTerm);
        
        // 3. Atualiza o cache APENAS se NÃO houver um termo de busca específico
        if (!searchTerm) {
            cache.data = cats;
            cache.timestamp = Date.now();
        }

        res.json(cats);
    } catch (err) {
        console.error('[DB ERROR] Falha na busca', err);
        res.status(500).json({ error: 'Erro ao buscar dados' });
    }
});


// ROTA DE INSERÇÃO (POST /api/cats)
router.post('/cats', authenticateToken, async (req, res) => {
    const { name, breed, image_url } = req.body;
    const owner_id = req.user.id; 

    if (!name || !breed) {
        return res.status(400).json({ error: 'Nome e raça são obrigatórios.' });
    }

    try {
        const newCat = await Cat.create({ name, breed, image_url, owner_id });
        cache.data = null; // Invalida cache
        res.status(201).json({ message: 'Gato inserido com sucesso!', cat: newCat });
    } catch (err) {
        console.error('[DB ERROR] Falha na inserção', err);
        res.status(500).json({ error: 'Erro ao inserir dado' });
    }
});

module.exports = router;