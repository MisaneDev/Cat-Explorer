// backend/src/models/catModel.js (CORREÇÃO DEFINITIVA)

const db = require('../config/database');

const Cat = {
    // MÉTODO ALL: Implementa o filtro de segurança (ownerId) e a busca (searchTerm)
    getAll: (ownerId, searchTerm) => {
        return new Promise((resolve, reject) => {
            
            // 1. Prepara o termo de busca com os curingas (%) para o SQL LIKE
            const term = searchTerm && searchTerm.trim() !== '' ? `%${searchTerm.trim()}%` : null;
            
            // 2. SQL Base: Filtra SEMPRE pelo usuário logado
            let sql = "SELECT * FROM cats WHERE owner_id = ?";
            let params = [ownerId]; 

            // 3. ADICIONA A CONDIÇÃO DE BUSCA SE HOUVER UM TERMO VÁLIDO
            if (term) {
                // Adiciona a condição AND (name LIKE ? OR breed LIKE ?)
                sql += " AND (name LIKE ? OR breed LIKE ?)";
                
                // Adiciona o termo para os 2 placeholders '?' do LIKE
                params.push(term, term); 
            }

            // 🛑 DEBUG CRÍTICO: Verifique este log no seu terminal
            console.log("SQL Executado:", sql, " | Parâmetros:", params);
            
            // 4. Executa a consulta
            db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error("Erro no SQL:", err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    },
    
    // MÉTODO CREATE: Inserção de um novo gato
    create: (catData) => {
        const nameToSave = String(catData.name || '').trim();
        const breedToSave = String(catData.breed || '').trim();
        const imageToSave = String(catData.image_url || '').trim();
        const ownerToSave = catData.owner_id;

        return new Promise((resolve, reject) => {
            const query = "INSERT INTO cats (name, breed, image_url, owner_id) VALUES (?, ?, ?, ?)";
            
            db.run(query, [nameToSave, breedToSave, imageToSave, ownerToSave], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...catData }); 
            });
        });
    },
    
    // MÉTODO REMOVE: Função para remover um gato por ID
    remove: (id) => {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM cats WHERE id = ?";
            db.run(query, [id], function(err) {
                if (err) reject(err);
                resolve(this.changes); 
            });
        });
    }
};

module.exports = Cat;