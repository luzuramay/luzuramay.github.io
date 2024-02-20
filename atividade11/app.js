const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Configurar o EJS como template engine
app.set('view engine', 'ejs');

// Definir o diretório de visualizações
app.set('views', path.join(__dirname, 'views'));

// Middleware para tratar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Array de usuários cadastrados (simulação)
const users = [
    { email: 'admin@gmail.com', password: 'admin123', name: 'Admin' },
    { email: 'user@gmail.com', password: 'user123', name: 'User' },
    { email: 'leo@gmail.com', password: 'leo123', name: 'Leo' },
    { email: 'mayara@gmail.com', password: 'mayara123', name: 'Mayara' }
];

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('login');
});

// Rota para página de login efetuado com sucesso
app.get('/login_success', (req, res) => {
    res.render('login_success');
});

// Rota para página de login falhou
app.get('/login_failed', (req, res) => {
    res.render('login_failed');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Verificar se o usuário existe no array de usuários
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // Se o usuário existe, redirecionar para a página de perfil
        res.render('profile', { user: user });
    } else {
        // Se o usuário não existe, renderizar a página de login novamente com uma mensagem de erro
        res.render('loginerror.ejs');
    }
});

// Rota para renderizar a página de registro
app.get('/registro', (req, res) => {
    res.render('registro', { erro: null }); // Passando null para erro inicialmente
});

// Rota para processar o formulário de registro
app.post('/registro', (req, res) => {
    const { nome, email, senha } = req.body;

    // Verificar se o email já está cadastrado
    const usuarioExistente = users.find(user => user.email === email);
    if (usuarioExistente) {
        res.render('registro', { erro: 'Este email já está cadastrado.' });
    } else {
        // Adicionar novo usuário à array de usuários
        users.push({ nome, email, senha });
        // Redirecionar para a página de sucesso após o registro
        res.render('login');
    }
});

// Rota GET para renderizar a página de listagem de usuários
app.get('/lista', (req, res) => {
    res.render('lista', { users });
});

// Rota POST para excluir um usuário
app.post('/lista/:id/excluir', (req, res) => {
    const userId = req.params.id;

    // Encontra o índice do usuário no array de usuários
    const index = users.findIndex(user => user.id === userId);

    // Se o usuário existe, remove-o do array de usuários
    if (index !== -1) {
        users.splice(index, 1);
    }

    // Redireciona de volta para a página de listagem de usuários após a exclusão
    res.redirect('/lista');
});


