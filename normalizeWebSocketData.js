const fs = require('fs');
const { tipoMap } = require('./normalizeCNABData.js');



//  normalizar os dados recebidos via WebSocket
function normalizeWebSocketData(data) {
    const fields = [
        { name: 'Tipo', start: 1, size: 1, end: 1 },
        { name: 'Data', start: 2, size: 8, end: 9 },
        { name: 'Valor', start: 10, size: 10, end: 19 },
        { name: 'CPF', start: 20, size: 11, end: 30 },
        { name: 'Cartao', start: 31, size: 12, end: 42 },
        { name: 'Dono da loja', start: 43, size: 14, end: 56 },
        { name: 'Nome da loja', start: 57, size: 18, end: 74 }
    ];

    

    const normalizedData = {};
    fields.forEach(field => {
        const value = data.substring(field.start - 1, field.end).trim();
        if (field.name === 'Tipo') {
            normalizedData[field.name] = tipoMap[value] || value;
        } else if (field.name === 'Valor') {
            const floatValue = parseFloat(value.replace(',', '.')) / 100;
            normalizedData[field.name] = formatCurrency(floatValue);
        } else if (field.name === 'Data') {
            const year = value.substr(0, 4);
            const month = value.substr(4, 2);
            const day = value.substr(6, 2);
            normalizedData[field.name] = `${year}/${month}/${day}`;
        } else if (field.name === 'CPF') {
            normalizedData[field.name] = isValidCPF(value) ? value : 'CPF INVÁLIDO';
        } else {
            normalizedData[field.name] = value;
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
    });

    return normalizedData;
}


// Função para formatar um valor para o formato de dinheiro com R$
function formatCurrency(value) {
    return `R$${value.toFixed(2).replace('.', ',')}`;
}


// Exemplo de uso
const receivedData = '...'; // Substitua pelo dado recebido via WebSocket
const normalizedData = normalizeWebSocketData(receivedData);
console.log(normalizedData);
