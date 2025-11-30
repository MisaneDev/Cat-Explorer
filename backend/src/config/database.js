// backend/src/config/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs'); // Necessário para hashing inicial

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar no Pool do SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Inicialização das tabelas
db.serialize(() => {
    // 1. Tabela de Usuários: Mudança para password_hash (para segurança)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password_hash TEXT NOT NULL
    )`);
    
    // 2. Tabela de Gatos
    db.run(`CREATE TABLE IF NOT EXISTS cats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        breed TEXT,
        image_url TEXT,
        owner_id INTEGER
    )`);

    // 3. Inserção do Usuário Padrão com HASH (Se o banco estiver vazio)
    const TEST_EMAIL = 'professor@utfpr.br';
    const TEST_PASSWORD = '123';
    
    // Usamos o get para verificar se o usuário existe
    db.get('SELECT COUNT(*) AS count FROM users WHERE email = ?', [TEST_EMAIL], async (err, row) => {
        if (err) {
            console.error('Erro ao verificar usuário de teste:', err);
            return;
        }

        if (row.count === 0) {
            // Gera o hash da senha
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(TEST_PASSWORD, salt);

            db.run(
                'INSERT INTO users (email, password_hash) VALUES (?, ?)',
                [TEST_EMAIL, password_hash],
                (err) => {
                    if (err) {
                        console.error('Erro ao inserir usuário de teste:', err);
                    } else {
                        console.log(`Usuário de teste '${TEST_EMAIL}' inserido. Senha: ${TEST_PASSWORD}`);
                    }
                }
            );
        }
    });
});

// Exporta o objeto de banco de dados diretamente
module.exports = db;