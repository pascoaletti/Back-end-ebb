const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs'); // Importar o módulo fs

// Caminho absoluto para o banco de dados
const dbPath = '../proj1/db/new_database.db';
console.log('Caminho do banco de dados:', dbPath); // Imprimir o caminho absoluto

// Verificar se o banco de dados já existe
const dbExists = fs.existsSync(dbPath);

// Criar ou abrir o banco de dados
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tipo TEXT,
            data TEXT,
            valor REAL,
            cpf TEXT,
            cartao TEXT,
            dono_da_loja TEXT,
            nome_da_loja TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
        } else {
            console.log('Tabela criada com sucesso.');
        }
    });

    // Consulta para calcular saldo por loja
    db.run(`
        CREATE VIEW IF NOT EXISTS saldo_por_loja AS
        SELECT nome_da_loja, SUM(valor) / 100 AS saldo
        FROM transactions
        GROUP BY nome_da_loja;
    `, (err) => {
        if (err) {
            console.error('Erro ao criar VIEW saldo_por_loja:', err);
        } else {
            console.log('VIEW saldo_por_loja criada com sucesso.');
        }
    });
});

db.close();
