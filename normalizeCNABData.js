function normalizeCNABData(fileContent) {
    const lines = fileContent.split('\n');
    const dataToInsert = [];

    const tipoMap = {
        '1': 'Débito',
        '2': 'Crédito',
        '3': 'Pix',
        '4': 'Financiamento'
    };

    lines.forEach(line => {
        if (line.length > 0) {
            const normalizedData = {};

            // Tipo
            const tipo = line.substring(0, 1);
            normalizedData['Tipo'] = tipoMap[tipo] || tipo;

            // Data
            const data = line.substring(1, 9);
            const year = data.substring(0, 4);
            const month = data.substring(4, 6);
            const day = data.substring(6, 8);
            normalizedData['Data'] = `${year}/${month}/${day}`;

            // Valor
            const valor = line.substring(9, 19);
            const floatValue = parseFloat(valor) / 100;
            normalizedData['Valor'] = formatCurrency(floatValue);

            // CPF
            normalizedData['CPF'] = line.substring(19, 30);

            // Cartão
            normalizedData['Cartao'] = line.substring(30, 42);

            // Dono da loja
            normalizedData['Dono da loja'] = line.substring(42, 56);

            // Nome da loja
            normalizedData['Nome da loja'] = line.substring(56, 74);

            dataToInsert.push(normalizedData);
        }
    });

    return dataToInsert;
}