import express from 'express';
import db from '../../db/conexao.js';
const router = express.Router();

//CREATE
router.post('/',async (req,res) =>{
    const { nome,descricao,duracao,status,data_criacao } = req.body;

    if ( nome == ''|| undefined) {
        res.status(401).json({ erro: 'nome curso  inesistente'});
        return;
    }

    try{
        const [result] = await db.execute(
            'INSERT INTO curso (nome, descricao, duracao, status,data_criacao) VALUES (?,?,?,?,?)',
            [nome, descricao, duracao, status,data_criacao]
        )
        res.status(201).json({ id: result.insertId, nome, descricao, duracao, status,data_criacao });
    }catch (err){res.status(500).json({ erro: err.message})
    };
});

//READ TODOS
router.get('/',async (req,res) =>{
    const[rows] = await db.execute('SELECT* FROM curso');
    res.json(rows);
});

//READ POR ID
router.get('/id/:curso_id',async (req,res) =>{
     const[rows] = await db.execute('SELECT* FROM curso WHERE curso_id =?', [req.params.curso_id] );
    if(rows.length === 0)
    return res.status(404).json({erro:'curso não encontrada'});
    res.json(rows[0]);
});

//UPDATE
router.put('/id/:curso_id',async (req,res) =>{
    const { nome,descricao,duracao,status,data_criacao } = req.body;
    try{
            await db.execute(
            'UPDATE curso SET nome =?, descricao =?, duracao =?, status =?, data_criacao =? WHERE curso_id =?',
            [nome, descricao, duracao, status, data_criacao, req.params.curso_id]
        );
        res.json({message:'curso atualizado com sucesso'});
    }catch (err){
        res.status(500).json({ erro: err.message});
    }
});

 //DELETE
   router.delete('/id/:curso_id',async (req,res) =>{
       try{
       
           await db.execute(
               'DELETE FROM curso WHERE curso_id =?',[req.params.curso_id]);
           res.json({messagem: 'curso removido com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });

export default router;
