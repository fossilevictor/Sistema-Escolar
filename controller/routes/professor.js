//trocar os nomezinhos (produtos) e seus atributos

/* i,portção de:
   -funcionalidades da biblioteca express
   -dados da conexão com banco de dados disponistos em conexão.js */
import express from 'express';
import db from '../../db/conexao.js';
//definição de constante para distinguir a rota recebida na requisição
const router = express.Router();


//CREATE
router.post('/', async (req, res) => {
    const { nome,
        sexo,
        cpf,
        nascimento,
        status,
        formacao,
        emissao,
        observacao,
        email,
        telefone,
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado } = req.body;

    const camposObrigatorios = ['nome',
        'sexo',
        'email',
        'telefone'];
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


    try {
        const [result] = await db.execute(
            'INSERT INTO professor (nome,sexo,cpf,nascimento,status,formacao,emissao,observacao,email,telefone,cep,rua,numero,complemento,bairro,cidade,estado ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
             [nome, sexo, cpf, nascimento, status, formacao, emissao, observacao, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado]
        );


        res.status(201).json({ id: result.insertId, nome,  sexo, cpf, nascimento, status, formacao, emissao, observacao, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado, message: "Professor inserido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }

});

//READ TODOS
router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT* FROM professor');
    res.json(rows);
});

router.get('/filtros/', async (req, res) => {

    let sqlCondicions = [];
    let sqlValues = [];

    const isParamValid = (param) => {
        return param !== undefined && param !== null && param !== '';
    };
    if (isParamValid(req.query.id)) {
        sqlCondicions.push('professor_id(?)');
        sqlValues.push(`%${req.query.nome}%`);
    }
    if (isParamValid(req.query.nome)) {
        sqlCondicions.push('UPPER(nome) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.nome}%`);
    }
    if (isParamValid(req.query.sexo)) {
        sqlCondicions.push('UPPER(sexo)=?');
        sqlValues.push(`%${req.query.sexo}%`);
    }
    if (isParamValid(req.query.cpf)) {
        sqlCondicions.push('UPPER(cpf)=?');
        sqlValues.push(`%${req.query.cpf}%`);
    }
    if (isParamValid(req.query.nascimento)) {
        sqlCondicions.push('UPPER(nascimento)=?');
        sqlValues.push(`%${req.query.nascimento}%`);
    }
    if (isParamValid(req.query.status)) {
        sqlCondicions.push('UPPER(status)=?');
        sqlValues.push(`%${req.query.status}%`);
    }

    if (isParamValid(req.query.formacao)) {
        sqlCondicions.push('UPPER(formacao)=?');
        sqlValues.push(`%${req.query.formacao}%`);
    }
    if (isParamValid(req.query.emissao)) {
        sqlCondicions.push('UPPER(emissao)=?');
        sqlValues.push(`%${req.query.emissao}%`);
    }
    if (isParamValid(req.query.observacao)) {
        sqlCondicions.push('UPPER(observacao) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.observacao}%`);
    }
    if (isParamValid(req.query.email)) {
        sqlCondicions.push('UPPER(email) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.email}%`);
    }
    if (isParamValid(req.query.telefone)) {
        sqlCondicions.push('UPPER(telefone) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.telefone}%`);
    }
    if (isParamValid(req.query.cep)) {
        sqlCondicions.push('UPPER(cep)=?');
        sqlValues.push(`%${req.query.cep}%`);
    }
    if (isParamValid(req.query.rua)) {
        sqlCondicions.push('UPPER(rua)=?');
        sqlValues.push(`%${req.query.rua}%`);
    }
    if (isParamValid(req.query.numero)) {
        sqlCondicions.push('UPPER(numero))=?');
        sqlValues.push(`%${req.query.numero}%`);
    }
    if (isParamValid(req.query.complemento)) {
        sqlCondicions.push('UPPER(complemento) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.complemento}%`);
    }
    if (isParamValid(req.query.bairro)) {
        sqlCondicions.push('UPPER(bairro) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.bairro}%`);
    }
    if (isParamValid(req.query.cidade)) {
        sqlCondicions.push('UPPER(cidade) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.cidade}%`);
    }
    if (isParamValid(req.query.estado)) {
        sqlCondicions.push('UPPER(estado) LIKE UPPER(?)');
        sqlValues.push(`%${req.query.estado}%`);
    }

    let whereClause = '';
    if (sqlCondicions.length > 0) {
        whereClause = `Where ${sqlCondicions.join(' AND ')}`
    }

    try {
        let comando = `SELECT * FROM professor ${whereClause} order by nome`;
        const [rows] = await db.execute(comando,sqlValues);
        
        res.json(rows);
    } catch (error) {
        res.status(500).json({erro: 'Erro' + error});
    }
    
});
//READ POR ID 
router.get('/:professor_id', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM professor WHERE professor_id =?', [req.params.professor_id]);
    if (rows.length === 0)
        return res.status(404).json({ erro: 'professor não encontrada!' });
    res.json(rows[0]);
});


//READ POR STATUS
router.get('/:professor_id', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM professor WHERE status =?', [req.params.professor_id]);
    if (rows.length === 0)
        return res.status(404).json({ erro: 'professor não encontrada!' });
    res.json(rows[0]);
});



//UPDATE 
router.put('/:professor_id', async (req, res) => {
    const { nome, sexo, cpf, nascimento, status, formacao, emissao, observacao, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
    try {
        await db.execute(
            'UPDATE professor SET  nome=?, sexo=?, cpf=?, nascimento=?, status=?, formacao=?, emissao=?, observacao=?, email=?, telefone=?, cep=?, rua=?, numero=?, complemento=?, bairro=?, cidade=?, estado=? WHERE professor_id =?',
            [nome, sexo, cpf, nascimento, status, formacao, emissao, observacao, email, telefone, cep, rua, numero, complemento, bairro, cidade, estado, req.params.professor_id]
        );
        res.json({ message: 'professor atualizado com suceso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
//DELETE
router.delete('/:professor_id', async (req, res) => {
    console.log('chamou o delete')
    try {
        const [result] = await db.execute(  
            'DELETE FROM professor WHERE professor_id =?', [req.params.professor_id]);
            if(result.affectedRows === 0){
                return res.status(404).json({erro:"Achei o fesor não"});
            }
        res.json({ messagem: 'professor removida com suceso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});
export default router;  