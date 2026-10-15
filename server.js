const express = require('express');
const cors = require('cors'); // <--- 1. Importe o cors aqui
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors()); // <--- 2. Ative o middleware do cors aqui
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

// Rota demonstrativa para testar o fluxo
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

    return res.status(200).json({
        sucesso: true,
        mensagem: 'Fluxo demonstrativo concluído.'
    });
});

// Inicialização
app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});