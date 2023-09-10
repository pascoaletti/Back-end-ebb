const express = require('express');
const http = require('http');
const path = require('path');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const WebSocket = require('ws');
const exec = require('child_process').exec;
const fs = require('fs');

const app = express();
const port = 3000;
const hostname = '127.0.0.1';

// Configurar pasta de recursos estáticos para o HTML e outros arquivos
app.use(express.static(path.join(__dirname, 'public')));

// Executar o script create-table.js para criar tabela e view
const createTableScriptPath = path.join(__dirname, 'db', 'create-table.js');
exec(`node ${createTableScriptPath}`, (error, stdout, stderr) => {
    if (error) {
        console.error('Erro ao executar create-table.js:', error);
    } else {
        console.log('Tabela e view criadas com sucesso.');
    }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configurar o multer para processar o upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Função para normalizar os dados do CNAB
function normalizeCNABData(fileContent) {
    const lines = fileContent.split('\n');
    const dataToInsert = [];

    lines.forEach(line => {
        if (line.length > 0) {
            const fields = [
                { name: 'Tipo', start: 1, size: 1, end: 1 },
                { name: 'Data', start: 2, size: 8, end: 9 },
                { name: 'Valor', start: 10, size: 10, end: 19 },
                { name: 'CPF', start: 20, size: 11, end: 30 },
                { name: 'Cartao', start: 31, size: 12, end: 42 },
                { name: 'Dono da loja', start: 43, size: 14, end: 56 },
                { name: 'Nome da loja', start: 57, size: 18, end: 74 }
            ];

            const rowData = fields.map(field => line.substring(field.start - 1, field.end).trim());
            dataToInsert.push(rowData);
        }
    });

    return dataToInsert;
}

// Rota para processar o upload e salvar no banco de dados
app.post('/upload', upload.single('file'), (req, res) => {
    const dataFilePath = req.file.path; // Caminho do arquivo temporário
    const fileData = fs.readFileSync(dataFilePath, 'utf8');

    // Normalizar os dados do CNAB
    const dataToInsert = normalizeCNABData(fileData);

  
    // Inserir dados normalizados no banco de dados
    const db = new sqlite3.Database('./db/new_database.db');
    const insertQuery = `INSERT INTO transactions (tipo, data, valor, cpf, cartao, dono_da_loja, nome_da_loja) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    dataToInsert.forEach(data => {
        db.run(insertQuery, data, (err) => {
            if (err) {
                console.error('Erro ao inserir dados:', err);
            }
        });
    });

    // Enviar as operações para os clientes conectados via WebSocket
    const operations = dataToInsert.map(data => ({
        tipo: data[0],
        data: data[1],
        valor: data[2],
        cpf: data[3],
        cartao: data[4],
        dono_da_loja: data[5],
        nome_da_loja: data[6]
    }));

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(operations));
        }
    });

    // Função para normalizar uma linha do arquivo CNAB
function normalizeLine(line) {
    const fields = [
        { name: 'Tipo', start: 1, size: 1, end: 1 },
        { name: 'Data', start: 2, size: 8, end: 10 },
        { name: 'CPF', start: 20, size: 11, end: 30 },
        { name: 'Cartao', start: 31, size: 12, end: 42 },
        { name: 'Dono da loja', start: 43, size: 14, end: 57 }, 
        { name: 'Nome da loja', start: 57, size: 18, end: 75 } 
    ];

    const normalizedData = {};
    fields.forEach(field => {
        const value = line.substring(field.start - 1, field.end).trim();
        if (field.name === 'Tipo') {
            normalizedData[field.name] = tipoMap[value] || value;
        } else if (field.name === 'Data') {
            const year = value.substr(0, 4);
            const month = value.substr(4, 2);
            const day = value.substr(6, 2);
            normalizedData[field.name] = `${year}/${month}/${day}`; // Função para formatar a data
        } else {
            normalizedData[field.name] = value;
        }
    });

    return normalizedData;
}

// Função para formatar um valor para o formato de dinheiro com R$
function formatCurrency(value) {
    return `R$${value.toFixed(2).replace('.', ',')}`;
}

// Verificar se um CPF é válido
function isValidCPF(cpf) {
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

    // Enviar o conteúdo normalizado para o cliente
    res.send('Arquivo processado, dados normalizados e ordenados com sucesso.');
});



// Rota para a página de upload
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

// Iniciar o servidor
server.listen(port, hostname, () => {
    console.log(`Servidor rodando em http://${hostname}:${port}/upload`);
});

// Configurar WebSocket para ouvir conexões
wss.on('connection', ws => {
    console.log('Cliente WebSocket conectado.');

    // Lidar com mensagens recebidas (se necessário)
    ws.on('message', message => {
        console.log(`Mensagem recebida: ${message}`);
    });

    // Quando novos dados são enviados via WebSocket, atualize a página
    ws.on('newData', data => {
        // Envie os dados recebidos para todos os clientes conectados
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
});