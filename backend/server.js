const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet'); 
const compression = require('compression'); 
const morgan = require('morgan'); 
const xss = require('xss-clean'); 
const bodyParser = require('body-parser'); // Importado para maior clareza

const authRoutes = require('./src/routes/authRoutes');
const catRoutes = require('./src/routes/catRoutes');

const app = express();

// Configurações de Segurança e Otimização
app.use(helmet());
// Configurações do CORS (permite que o Front-end acesse)
app.use(cors({
    origin: 'https://localhost:5173', // Permite apenas seu Front-end HTTPS
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(compression()); 
// Usa o body-parser embutido do Express para JSON
app.use(express.json()); 
app.use(xss()); 
app.use(morgan('combined')); // Log de requisições

// Rotas
app.use('/api', authRoutes);
app.use('/api', catRoutes);

// Configuração HTTPS
const httpsOptions = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const PORT = 3000;
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Servidor rodando seguro em https://localhost:${PORT}`);
});