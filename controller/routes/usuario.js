import express from 'express';
import db from '../../db/conexao.js';
import bcrypt from 'bcrypt';
//definição de constante para distinguir a rota recebida na requisição
const router = express.Router();


//CREATE
router.post('/', async (req, res) => {
    const { nome,
        email,
        senha,
        data_nascimento,
        sexo,
        perfil,
        status,
        } = req.body;

    const camposObrigatorios = ['nome',
        'email',
        'senha'];
    const camposFaltando = [];

    for (const campo of camposObrigatorios) {
        if (!req.body.hasOwnProperty(campo) || req.body[campo] === null || req.body[campo] === undefined || req.body[campo] === '') {
            camposFaltando.push(campo);
        }
    }
    if (camposFaltando.length > 0) {
        res.status(401).json({ erro: `Nome obrigatório não informado:${camposFaltando.join(',')}` });
        return;
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    
    try {
        const [result] = await db.execute(
            'INSERT INTO usuario (nome,email,data_nascimento,sexo,perfil,status,senha_hash ) VALUES (?,?,?,?,?,?,?)',
             [nome,email,data_nascimento,sexo,perfil,status, senha_hash]
        );


        res.status(201).json({ id: result.insertId,nome, message: "usuario inserido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }

});



router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // 1. Buscar usuário no banco (inclui campos necessários para retorno)
        const [rows] = await db.execute(
            'SELECT usuario_id, nome, email, perfil, status, data_nascimento, sexo, senha_hash FROM usuario WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ mensagem: "Usuário não encontrado" });
        }

        const usuario = rows[0];

        // 2. Comparar a senha digitada com o hash salvo
        const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaConfere) {
            return res.status(401).json({ mensagem: "Senha incorreta" });
        }

        // Remover o hash antes de retornar os dados ao cliente
        const usuarioRetorno = {
            usuario_id: usuario.usuario_id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            status: usuario.status,
            data_nascimento: usuario.data_nascimento,
            sexo: usuario.sexo
        };

        res.json({ mensagem: "Login realizado com sucesso!", usuario: usuarioRetorno });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro no servidor" });
    }
});


//READ TODOS
router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT* FROM usuario');
    res.json(rows);
});

//READ POR ID 
router.get('/id/:usuario_id', async (req, res) => {
    const [rows] = await db.execute('SELECT* FROM usuario WHERE usuario_id =?', [req.params.usuario_id]);
    if (rows.length === 0)
        return res.status(404).json({ erro: 'usuario não encontrada' });
    res.json(rows[0]);
});

router.get('/filtros/', async (req, res) => {

    console.log(req.query);
    let sqlCondicions = [];
    let sqlValues = [];

    const isParamValid = (param) => {
        return param !== undefined && param !== null && param !== '';
    };
    


    if (isParamValid(req.query.nome)) {
        sqlCondicions.push('UPPER(nome) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.nome}%`);
    }
    if (isParamValid(req.query.email)) {
        sqlCondicions.push('UPPER(email)=?');
        sqlValues.push(`%${req.query.email}%`);
    }
    if (isParamValid(req.query.data_nascimento)) {
        sqlCondicions.push('UPPER(data_nascimento)=?');
        sqlValues.push(`%${req.query.data_nascimento}%`);
    }
    if (isParamValid(req.query.sexo)) {
        sqlCondicions.push('UPPER(sexo)=?');
        sqlValues.push(`%${req.query.sexo}%`);
    }
    if (isParamValid(req.query.perfil)) {
        sqlCondicions.push('UPPER(perfil)=?');
        sqlValues.push(`%${req.query.perfil}%`);
    }

    if (isParamValid(req.query.status)) {
        sqlCondicions.push('UPPER(status)=?');
        sqlValues.push(`%${req.query.status}%`);
    }
   

    let whereClause = '';
    if (sqlCondicions.length > 0) {
        whereClause = `Where ${sqlCondicions.join(' AND ')}`
    }

    try {
        let comando = `SELECT * FROM usuario ${whereClause} order by nome`;
        const [rows] = await db.execute(comando,sqlValues);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({erro: 'Erro' + error});
    }
    
});

//read por nome

router.get('/nome',async (req,res) =>{
    const[rows] = await db.execute('SELECT* FROM usuario WHERE nome =?', [req.params.nome]);
    if(rows.length === 0)
        return res.status(404).json({erro:'usus não encontrada'});
        res.json(rows);

})

router.get('/senha_hash',async (req,res)=>{
     const [rows] = await db.execute('SELECT* FROM usuario WHERE senha_hash =?', [req.params.senha_hash]);
    if (rows.length === 0)
        return res.status(404).json({ erro: 'usuario não encontrada' });
    res.json(rows[0]);
})

router.get('/email/:email', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM usuario WHERE email = ?', [req.params.email]);
    if (rows.length === 0) 
        return res.status(404).json({ mensagem: 'Usuário nãoooo encontrado' });
    
    return res.status(200).json(rows[0]);
    
});

//UPDATE 
router.put('/usuario/:usuario_id', async (req, res) => {
    const {nome,email,data_nascimento,sexo,perfil,status,senha } = req.body;
    try {
         const senha_hash = await bcrypt.hash(senha, 10);
        await db.execute(
            'UPDATE usuario SET nome = ?, email = ?, data_nascimento = ?, sexo = ?, perfil = ?, status = ?,  senha_hash = ? WHERE usuario_id = ?',
             [nome,email,data_nascimento,sexo,perfil,status, senha_hash,req.params.usuario_id]
        );
       return res.status(200).json({ message: 'usuario atualizado com suceso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


// Rota para alterar apenas a senha (atualiza senha_hash)
router.put('/senha/:usuario_id', async (req, res) => {
    const { senha } = req.body;
    if (!senha) {
        return res.status(400).json({ mensagem: 'Senha é obrigatória' });
    }
    try {
        const senha_hash = await bcrypt.hash(senha, 10);
        const [result] = await db.execute(
            'UPDATE usuario SET senha_hash = ? WHERE usuario_id = ?',
            [senha_hash, req.params.usuario_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }
        return res.json({ mensagem: 'Senha alterada com sucesso' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ mensagem: 'Erro ao alterar senha' });
    }
});


router.delete('/:usuario_id', async (req, res) => {
    try {
        const [result] = await db.execute(  
            'DELETE FROM usuario WHERE usuario_id =?', [req.params.usuario_id]);
            if(result.affectedRows === 0){
                return res.status(404).json({erro:"Achei o usus não"});
            }
        res.json({ messagem: 'Usuario removido com suceso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
export default router;