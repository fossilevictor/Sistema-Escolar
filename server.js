// Importações principais
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import das rotas da API
import cursoRouter from './controller/routes/curso.js';
import alunoRouter from './controller/routes/aluno.js';
import disciplinaRouter from './controller/routes/disciplina.js';
import matriculaRouter from './controller/routes/matricula.js';
import notasRouter from './controller/routes/notas.js';
import professorRouter from './controller/routes/professor.js';
import turmaRouter from './controller/routes/turma.js';
import usuarioRota from './controller/routes/usuario.js';

// Configuração inicial do servidor
const app = express();
app.use(express.json());
app.use(cors());

// Caminho absoluto do projeto (necessário para usar express.static corretamente)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos (HTML, CSS, JS) diretamente pelo servidor
// Permite acessar: http://localhost:3000/login.html
app.use(express.static(path.join(__dirname, '/')));

// ✅ Permite ue o navegador acesse os arquivos HTML/CSS/JS
// Exemplo: public/professor.html → http://localhost:3000/professor.html
//app.use(express.static(path.join(__dirname, 'public')));

// ✅ Permite que o navegador acesse arquivos da pasta controller (ex: controller/professor.js)
//app.use('/controller', express.static(path.join(__dirname, 'controller')));

// ✅ Rotas da API (backend)
app.use('/curso', cursoRouter);
app.use('/aluno', alunoRouter);
app.use('/disciplina', disciplinaRouter);
app.use('/matricula', matriculaRouter);
app.use('/notas', notasRouter);
app.use('/professor', professorRouter);
app.use('/turma', turmaRouter);
app.use('/usuario', usuarioRota);

// Inicia o servidor
app.listen(3000, () => {
    console.log('✅ Servidor rodando na porta 3000');
});
