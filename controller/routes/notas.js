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
        const { matricula_id,tipo_avaliacao,data_avaliacao,valor_nota } = req.body;

        if (tipo_avaliacao == ''|| undefined) {
            res.status(401).json({ erro: 'tipo de avalição não informada!'});
            return;
        }
        if (data_avaliacao == ''|| undefined) {
            res.status(401).json({ erro: ' data da avaliação não informada!'});
            return;
        }
        if (valor_nota == ''|| undefined) {
            res.status(401).json({ erro: ' valor da nota não informada!'});
            return;
        }

        try{
            const [result] = await db.execute(
                            'INSERT INTO notas (matricula_id, tipo_avaliacao, data_avaliacao, valor_nota) VALUES (?,?,?,?)',
                            [matricula_id, tipo_avaliacao, data_avaliacao, valor_nota]
                            );

            if(matricula_id == ''){
                res.status(402).json({ erro: ' matricula inesistente'});
                return;
            }
           
           res.status(201).json({ id: result.insertId,matricula_id,tipo_avaliacao,data_avaliacao,valor_nota});
            }catch (err){
                res.status(500).json({ erro: err.message});
            }
         
    });
    //READ TODOS
    router.get('/',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM notas');
        res.json(rows);
    });
    //READ POR ID 
    router.get('/id/:notas_id',async (req,res) =>{
         const[rows] = await db.execute('SELECT* FROM notas WHERE notas_id =?', [req.params.notas_id] );
        if(rows.length === 0)
        return res.status(404).json({erro:'nota não encontrada'});
        res.json(rows[0]);
   });

      //READ POR tipo de avaliação
    router.get('/tipo_avaliacao/:tipo_avaliacao',async (req,res) =>{
        const[rows] = await db.execute('SELECT* FROM notas WHERE tipo_avaliacao =?', [req.params.tipo_avaliacao] );
       if(rows.length === 0)
       return res.status(404).json({erro:'tipo de prova não encontrada'});
       res.json(rows[0]);
  });



  //READ POR data da avaliação
  router.get('/data_avaliacao/:data_avaliacao',async (req,res) =>{
    const[rows] = await db.execute('SELECT* FROM notas WHERE data_avaliacao =?', [req.params.data_avaliacao] );
   if(rows.length === 0)
   return res.status(404).json({erro:'data não encontrada'});
   res.json(rows[0]);
});


     //READ POR aluno
   router.get('/aluno/:aluno_id', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT notas.*, matricula.aluno_id
            FROM notas 
            INNER JOIN matricula ON matricula.matricula_id = notas.matricula_id
            WHERE matricula.aluno_id = ?
        `, [req.params.aluno_id]);

        if (rows.length === 0)
            return res.status(404).json({ erro: 'Aluno não encontrado' });

        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});



 router.get('/turma/:turma_id', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT notas.*, turma.nome AS nome_turma
            FROM notas
            INNER JOIN matricula ON notas.matricula_id = matricula.matricula_id
            INNER JOIN turma ON matricula.turma_id = turma.turma_id
            WHERE turma.turma_id = ?
        `, [req.params.turma_id]);

        if (rows.length === 0)
            return res.status(404).json({ erro: 'Turma não encontrada' });

        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});


  router.put('/id/:notas_id', async (req, res) => {
    const { matricula_id, tipo_avaliacao, data_avaliacao, valor_nota } = req.body;

    if (tipo_avaliacao === '' || tipo_avaliacao === undefined) {
        return res.status(401).json({ erro: 'tipo de avaliação não informada!' });
    }
    if (data_avaliacao === '' || data_avaliacao === undefined) {
        return res.status(401).json({ erro: 'data da avaliação não informada!' });
    }
    if (valor_nota === '' || valor_nota === undefined) {
        return res.status(401).json({ erro: 'valor da nota não informada!' });
    }

    try {
        if (matricula_id === '' || matricula_id === undefined) {
            return res.status(401).json({ erro: 'matrícula inexistente' });
        } else {
            const [rows] = await db.execute('SELECT * FROM matricula WHERE matricula_id = ?', [matricula_id]);
            if (rows.length === 0) {
                return res.status(402).json({ erro: 'matrícula não encontrada' });
            }
        }

        await db.execute(
            'UPDATE notas SET matricula_id = ?, tipo_avaliacao = ?, data_avaliacao = ?, valor_nota = ? WHERE notas_id = ?',
            [matricula_id, tipo_avaliacao, data_avaliacao, valor_nota, req.params.notas_id]
        );

        res.json({ message: 'nota atualizada com sucesso' });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

   //DELETE
   router.delete('/id/:notas_id',async (req,res) =>{
       try{
           await db.execute(
               'DELETE FROM notas WHERE notas_id =?',[req.params.notas_id]);
           res.json({messagem: 'matricula removida com suceso'});
       }catch(err){
           res.status(500).json({erro:err.message});
       }    
   });
   export default router;
   
   
   