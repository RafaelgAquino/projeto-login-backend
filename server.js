const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração de Middlewares
app.use(cors()); // Permite que o front-end faça pedidos a este servidor
app.use(express.json()); // Permite ler dados em formato JSON no corpo das requisições

// Rota POST para receber o login
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Validação básica
    if (!usuario || !senha) {
        return res.status(400).json({ 
            sucesso: false, 
            mensagem: 'Usuário e senha são obrigatórios.' 
        });
    }

    console.log(`Login recebido -> Utilizador: ${usuario} | Palavra-passe: ${senha}`);

    // Caminho para o ficheiro JSON onde vamos guardar os dados
    const filePath = path.join(__dirname, 'usuarios.json');
    let dadosSalvos = [];

    // Se o ficheiro já existir, lê o conteúdo atual
    if (fs.existsSync(filePath)) {
        try {
            const fileData = fs.readFileSync(filePath, 'utf-8');
            dadosSalvos = JSON.parse(fileData);
        } catch (error) {
            dadosSalvos = [];
        }
    }

    // Adiciona o novo login à lista (com data e hora)
    dadosSalvos.push({
        usuario,
        senha,
        dataAcesso: new Date().toISOString()
    });

    // Guarda de volta no ficheiro JSON (formatado com 2 espaços)
    fs.writeFileSync(filePath, JSON.stringify(dadosSalvos, null, 2));

    // Responde ao front-end com sucesso e um token simulado
    return res.status(200).json({
        sucesso: true,
        mensagem: 'Login efetuado e guardado com sucesso!',
        token: 'token-jwt-exemplo-abc123xyz'
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor back-end a correr em http://localhost:${PORT}`);
});