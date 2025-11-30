// backend/src/models/userModel.js

const db = require('../config/database'); 
const bcrypt = require('bcryptjs');

// Promisify db.get para podermos usar async/await
function getAsync(sql, params) {
    return new Promise((resolve, reject) => {
        // Usa db.get com callback, que é o padrão do sqlite3
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const User = {
    findByCredentials: async (email, password) => {
        try {
            // 1. Busca o usuário pelo e-mail
            // A coluna deve ser 'password_hash' para funcionar com bcrypt.compare
            const user = await getAsync('SELECT id, email, password_hash FROM users WHERE email = ?', [email]);

            // VERIFICAÇÃO FINAL: Se o usuário não existe OU o hash está faltando
            if (!user || !user.password_hash) { 
                return null; 
            }

            // 2. Compara a senha (agora user.password_hash é garantidamente uma string)
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (isMatch) {
                return { id: user.id, email: user.email }; 
            } else {
                return null; // Senha incorreta
            }

        } catch (error) {
            console.error('Erro em findByCredentials:', error.message);
            // Retorna null em caso de erro de DB/bcrypt para evitar crash fatal
            return null; 
        }
    },
    
    // Funçao de criação (para uso em admin ou registro)
    create: async (email, password) => {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                [email, password_hash],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ id: this.lastID, email });
                    }
                }
            );
        });
    }
};

module.exports = User;