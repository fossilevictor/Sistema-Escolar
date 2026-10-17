//trocar os nomezinhos (produtos) e seus atributos

/* i,portção de:
   -funcionalidades da biblioteca express
   -dados da conexão com banco de dados disponistos em conexão.js */
   import express from 'express';
   import db from '../../db/conexao.js';
    //definição de constante para distinguir a rota recebida na requisição
    const router = express.Router();


    //CREATE
    router.post('/',async (req,res) =>{
        const { matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso } = req.body;

        if (nome.trim() == '' || nome == undefined) {
            res.status(401).json({ erro: 'Nome obrigatório não informado!'});
            return;
        }

        try{
            const [result] = await db.execute(
                    'INSERT INTO aluno (matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso]
                    );
           res.status(201).json({ id: result.insertId,matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso, message: "Aluno inserido com sucesso!" });
            }catch (err){
                res.status(500).json({ erro: err.message});
            }
         
    });

    //READ TODOS
    router.get('/',async (req,res) =>{
        const[rows] = await db.execute('SELECT * FROM aluno');
        res.json(rows);
    });

    //READ POR ano 
    router.get('/nascimento/:ano_nascimento',async (req,res) =>{
         const[rows] = await db.execute(`select*
                                           from aluno
                                          where year(data_nascimento) = ?`, [req.params.ano_nascimento] );
        if (rows.length === 0)
            return res.status(404).json({erro:'Informações não encontradas'});
        
        res.json(rows[0]);
   });

   //READ POR ID 
router.get('/id/:aluno_id',async (req,res) =>{
   const[rows] = await db.execute('SELECT* FROM aluno WHERE aluno_id = ?', [req.params.aluno_id] );
   
   if(rows.length === 0)
        return res.status(404).json({erro:'Aluno não encontrado'});
   
   res.json(rows[0]);
});

//UPDATE
router.put('/id/:aluno_id', async (req, res) => {
    const { matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso } = req.body;

    if (!nome || nome.trim() === '') {
        res.status(401).json({ erro: 'Nome obrigatório não informado!' });
        return;
    }

    /*if (!req.params.id) {
        res.status(400).json({ erro: 'ID não informado!' });
        return;
    }*/

    try {
        await db.execute(
            'UPDATE aluno SET matricula = ?,nome = ?,sobrenome = ?, data_nascimento = ?,sexo =?,cpf = ?,situacao = ?, email = ?, telefone = ?, numero = ?,rua = ?,complemento = ?,bairro = ?,cidade = ?,estado = ?,data_ingresso = ? WHERE aluno_id = ?',
            [matricula,nome,sobrenome,data_nascimento,sexo,cpf,situacao,email,telefone,numero,rua,complemento,bairro,cidade,estado,data_ingresso, req.params.aluno_id]
        );
        res.json({ message: 'Aluno atualizado com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

   //DELETE
   router.delete('/id/:aluno_id',async (req,res) =>{
       try{
           await db.execute(
               'DELETE FROM aluno WHERE aluno_id =?',[req.params.aluno_id]);
           res.json({messagem: 'aluno removido com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });
   export default router;
   
   
   